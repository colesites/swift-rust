pub use swift_rust_api as api;
pub use swift_rust_build as build;
pub use swift_rust_build_test as build_test;
pub use swift_rust_bundler as bundler;
pub use swift_rust_code_frame as code_frame;
pub use swift_rust_config as config;
pub use swift_rust_core as core;
pub use swift_rust_custom_transforms as custom_transforms;
pub use swift_rust_error_code_swc_plugin as error_code_swc_plugin;
pub use swift_rust_errors as errors;
pub use swift_rust_font as font;
pub use swift_rust_image as image;
pub use swift_rust_pdf as pdf;
pub use swift_rust_runtime as runtime;
pub use swift_rust_server as server;
pub use swift_rust_taskless as taskless;
pub use swift_rust_telemetry as telemetry;

pub mod prelude {
    pub use crate::api::{ApiError, PageResponse, RequestContext};
    pub use crate::build::{BuildConfig, BuildInput, BuildOutput, BuildPipeline, BuildTarget};
    pub use crate::code_frame::{
        extract as extract_code_frame, render_ansi, render_html, render_plain, CodeFrame, Location,
        Style,
    };
    pub use crate::config::Config;
    pub use crate::core::{
        AssetKind, AssetRef, HttpMethod, ProjectInfo, RenderMode, RouteParams, RouteSegment,
    };
    pub use crate::error_code_swc_plugin::{CodeRegistry, ErrorCode};
    pub use crate::errors::{Error, Result};
    pub use crate::server::{Request, Response, RouteContext, Router};
    pub use crate::taskless::{debounce, TaskKey, Taskless};
}
