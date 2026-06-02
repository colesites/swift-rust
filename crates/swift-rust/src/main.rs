use clap::{Parser, Subcommand};
use swift_rust_errors::Result;

#[derive(Parser, Debug)]
#[command(name = "swift-rust", version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    Dev {
        #[arg(short, long, default_value_t = 3000)]
        port: u16,
    },
    Build {
        #[arg(long, value_enum, default_value_t = Mode::Ssr)]
        mode: Mode,
    },
    Start {
        #[arg(short, long, default_value_t = 3000)]
        port: u16,
    },
    Lint,
    Test,
    Info,
}

#[derive(clap::ValueEnum, Clone, Debug)]
enum Mode {
    Ssr,
    SsrWasm,
    SsrHtmx,
    Wasm,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let cli = Cli::parse();

    match cli.command {
        Commands::Dev { port } => {
            swift_rust_server::dev_server(port).await?;
        }
        Commands::Build { mode } => {
            let m = match mode {
                Mode::Ssr => "ssr",
                Mode::SsrWasm => "ssr-wasm",
                Mode::SsrHtmx => "ssr-htmx",
                Mode::Wasm => "wasm",
            };
            swift_rust_bundler::build(m).await?;
        }
        Commands::Start { port } => {
            swift_rust_server::start(port).await?;
        }
        Commands::Lint => swift_rust_server::lint().await?,
        Commands::Test => swift_rust_server::test().await?,
        Commands::Info => {
            println!("swift-rust {}", env!("CARGO_PKG_VERSION"));
            println!("rendering modes: ssr, ssr-wasm, ssr-htmx, wasm");
        }
    }

    Ok(())
}
