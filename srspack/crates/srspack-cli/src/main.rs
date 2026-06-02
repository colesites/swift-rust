use std::path::PathBuf;
use std::process::ExitCode;

use clap::{Parser, Subcommand};

use srspack_core::options::Mode;
use srspack_core::{BundleOptions, Profile, Srspack};
use srspack_loader_css::CssLoader;
use srspack_loader_tsx::TsxLoader;

#[derive(Debug, Parser)]
#[command(
    name = "srspack",
    version,
    about = "The bundler for Swift-Rust. Native, content-addressed, single-graph.",
    long_about = None
)]
struct Cli {
    #[command(subcommand)]
    command: Command,

    #[arg(long, global = true, default_value = "info")]
    log: String,

    #[arg(long, global = true)]
    config: Option<PathBuf>,
}

#[derive(Debug, Subcommand)]
enum Command {
    /// Build the project once and write the output to disk.
    Build {
        #[arg(long, default_value = "production")]
        mode: String,
        #[arg(long, default_value = "dist")]
        out: PathBuf,
        #[arg(long)]
        sourcemap: bool,
        #[arg(long)]
        minify: bool,
        /// Print per-stage timing breakdown after the build.
        #[arg(long)]
        profile: bool,
    },
    /// Start a development server with HMR.
    Dev {
        #[arg(long, default_value = "development")]
        mode: String,
        #[arg(long, default_value = "3000")]
        port: u16,
        #[arg(long, default_value = "dist")]
        out: PathBuf,
    },
    /// Run the benchmark harness and print a results table.
    Bench {
        #[arg(long, default_value = "./bench/fixtures")]
        fixture_dir: PathBuf,
        #[arg(long, default_value_t = 5)]
        iterations: u32,
    },
    /// Print the resolved configuration as JSON.
    Config,
    /// Print version, compile target, and key crate versions.
    Info,
}

fn init_tracing(filter: &str) {
    use tracing_subscriber::{fmt, EnvFilter};
    let _ = fmt()
        .with_env_filter(EnvFilter::try_new(filter).unwrap_or_else(|_| EnvFilter::new("info")))
        .with_target(false)
        .try_init();
}

#[tokio::main]
async fn main() -> ExitCode {
    let cli = Cli::parse();
    init_tracing(&cli.log);

    match run(cli).await {
        Ok(()) => ExitCode::SUCCESS,
        Err(err) => {
            eprintln!("srspack: {err:?}");
            ExitCode::from(1)
        }
    }
}

async fn run(cli: Cli) -> anyhow::Result<()> {
    let srspack = Srspack::new();
    srspack.register_loader(Box::new(TsxLoader::new()));
    srspack.register_loader(Box::new(CssLoader::new()));

    match cli.command {
        Command::Build { mode, out, sourcemap, minify, profile } => {
            let m = Mode::from_mode_str(&mode).ok_or_else(|| anyhow::anyhow!("invalid mode: {mode}"))?;
            let opts = BundleOptions {
                mode: m,
                out_dir: out,
                sourcemap,
                minify,
                ..BundleOptions::default()
            };
            if profile {
                let mut p = Profile::new();
                let _output = srspack.build_with_profile(&std::env::current_dir()?, &opts, &mut p)?;
                println!("\n{}", p.render());
            } else {
                let _output = srspack.build(&std::env::current_dir()?, &opts)?;
            }
            Ok(())
        }
        Command::Dev { mode, port: _port, out } => {
            let m = Mode::from_mode_str(&mode).ok_or_else(|| anyhow::anyhow!("invalid mode: {mode}"))?;
            let opts = BundleOptions {
                mode: m,
                out_dir: out,
                sourcemap: true,
                minify: false,
                ..BundleOptions::default()
            };
            srspack.watch(&std::env::current_dir()?, opts).await?;
            Ok(())
        }
        Command::Bench { fixture_dir, iterations } => {
            run_bench(&fixture_dir, iterations).await
        }
        Command::Config => {
            let opts = BundleOptions::default();
            let json = serde_json::to_string_pretty(&opts)?;
            println!("{json}");
            Ok(())
        }
        Command::Info => {
            println!("srspack {}", env!("CARGO_PKG_VERSION"));
            println!("target {}", std::env::consts::ARCH);
            println!("os     {}", std::env::consts::OS);
            Ok(())
        }
    }
}

async fn run_bench(fixture_dir: &std::path::Path, iterations: u32) -> anyhow::Result<()> {
    use std::time::Instant;
    let srspack = Srspack::new();
    srspack.register_loader(Box::new(TsxLoader::new()));
    srspack.register_loader(Box::new(CssLoader::new()));

    if !fixture_dir.exists() {
        anyhow::bail!("fixture dir does not exist: {}", fixture_dir.display());
    }

    let opts = BundleOptions {
        mode: Mode::Production,
        out_dir: fixture_dir.join("dist"),
        sourcemap: false,
        minify: true,
        ..BundleOptions::default()
    };

    println!("benchmarking srspack on {}", fixture_dir.display());
    println!("iterations: {iterations}");
    println!();

    let mut durations_ms: Vec<f64> = Vec::with_capacity(iterations as usize);
    for i in 1..=iterations {
        let start = Instant::now();
        let _ = srspack.build(fixture_dir, &opts)?;
        let elapsed = start.elapsed();
        let ms = elapsed.as_secs_f64() * 1000.0;
        durations_ms.push(ms);
        println!("  run {i:>3}: {ms:>8.2} ms");
    }

    let min = durations_ms.iter().cloned().fold(f64::INFINITY, f64::min);
    let max = durations_ms.iter().cloned().fold(0.0_f64, f64::max);
    let sum: f64 = durations_ms.iter().sum();
    let mean = sum / durations_ms.len() as f64;
    let mut sorted = durations_ms.clone();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let median = sorted[sorted.len() / 2];

    println!();
    println!("min    {min:>8.2} ms");
    println!("median {median:>8.2} ms");
    println!("mean   {mean:>8.2} ms");
    println!("max    {max:>8.2} ms");
    Ok(())
}
