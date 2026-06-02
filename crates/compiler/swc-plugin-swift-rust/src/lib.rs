#![cfg_attr(not(feature = "swc_plugin"), allow(unused))]

use serde::{Deserialize, Serialize};
use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::*;
use swc_core::ecma::visit::VisitMut;
use swc_core::ecma::visit::VisitMutWith;
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

#[derive(Serialize, Deserialize, Debug, Default)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransformConfig {
    pub rendering: Option<String>,
    pub component_prefix: Option<String>,
}

pub struct JsxToRust {
    pub config: TransformConfig,
}

impl JsxToRust {
    pub fn new(config: TransformConfig) -> Self {
        Self { config }
    }
}

impl VisitMut for JsxToRust {
    fn visit_mut_jsx_element(&mut self, el: &mut JSXElement) {
        el.children.visit_mut_with(self);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        for item in items.iter_mut() {
            item.visit_mut_with(self);
        }
    }
}

#[plugin_transform]
pub fn process_transform(
    mut program: Program,
    _metadata: TransformPluginProgramMetadata,
    config: serde_json::Value,
) -> Program {
    let cfg: TransformConfig = serde_json::from_value(config).unwrap_or_default();
    program.visit_mut_with(&mut JsxToRust::new(cfg));
    let _ = DUMMY_SP;
    program
}
