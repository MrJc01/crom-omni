//! Vue/Svelte Generator - Frontend Framework Generation
//!
//! Generates Vue and Svelte components from Omni code.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// Target framework
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum VueTarget {
    Vue2,
    Vue3,
    Svelte,
}

impl VueTarget {
    pub fn extension(&self) -> &'static str {
        match self {
            VueTarget::Vue2 | VueTarget::Vue3 => "vue",
            VueTarget::Svelte => "svelte",
        }
    }
}

/// Component prop
#[derive(Debug, Clone)]
pub struct ComponentProp {
    pub name: String,
    pub prop_type: String,
    pub required: bool,
    pub default: Option<String>,
}

/// Component state
#[derive(Debug, Clone)]
pub struct ComponentState {
    pub name: String,
    pub initial_value: String,
}

/// Component definition
#[derive(Debug, Clone)]
pub struct VueComponent {
    pub name: String,
    pub props: Vec<ComponentProp>,
    pub state: Vec<ComponentState>,
    pub template: String,
}

impl VueComponent {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            props: Vec::new(),
            state: Vec::new(),
            template: String::new(),
        }
    }

    /// Generate Vue 3 SFC
    pub fn to_vue3(&self) -> String {
        let mut output = String::new();

        // Script setup
        output.push_str("<script setup lang=\"ts\">\n");
        
        if !self.props.is_empty() {
            output.push_str("interface Props {\n");
            for prop in &self.props {
                let optional = if prop.required { "" } else { "?" };
                output.push_str(&format!("  {}{}: {}\n", prop.name, optional, prop.prop_type));
            }
            output.push_str("}\n\n");
            output.push_str("const props = defineProps<Props>()\n\n");
        }

        for s in &self.state {
            output.push_str(&format!("const {} = ref({})\n", s.name, s.initial_value));
        }

        output.push_str("</script>\n\n");

        // Template
        output.push_str("<template>\n");
        if self.template.is_empty() {
            output.push_str("  <div>\n");
            output.push_str(&format!("    <h1>{}</h1>\n", self.name));
            output.push_str("  </div>\n");
        } else {
            output.push_str(&self.template);
        }
        output.push_str("</template>\n\n");

        // Style
        output.push_str("<style scoped>\n");
        output.push_str("</style>\n");

        output
    }

    /// Generate Vue 2 Options API
    pub fn to_vue2(&self) -> String {
        let mut output = String::new();

        output.push_str("<template>\n");
        output.push_str("  <div>\n");
        output.push_str(&format!("    <h1>{}</h1>\n", self.name));
        output.push_str("  </div>\n");
        output.push_str("</template>\n\n");

        output.push_str("<script>\n");
        output.push_str("export default {\n");
        output.push_str(&format!("  name: '{}',\n", self.name));
        
        if !self.props.is_empty() {
            output.push_str("  props: {\n");
            for prop in &self.props {
                output.push_str(&format!("    {}: {{\n", prop.name));
                output.push_str(&format!("      type: {},\n", capitalize(&prop.prop_type)));
                output.push_str(&format!("      required: {}\n", prop.required));
                output.push_str("    },\n");
            }
            output.push_str("  },\n");
        }

        if !self.state.is_empty() {
            output.push_str("  data() {\n");
            output.push_str("    return {\n");
            for s in &self.state {
                output.push_str(&format!("      {}: {},\n", s.name, s.initial_value));
            }
            output.push_str("    }\n");
            output.push_str("  }\n");
        }

        output.push_str("}\n");
        output.push_str("</script>\n");

        output
    }

    /// Generate Svelte component
    pub fn to_svelte(&self) -> String {
        let mut output = String::new();

        output.push_str("<script lang=\"ts\">\n");
        
        for prop in &self.props {
            output.push_str(&format!("  export let {}: {};\n", prop.name, prop.prop_type));
        }

        for s in &self.state {
            output.push_str(&format!("  let {} = {};\n", s.name, s.initial_value));
        }

        output.push_str("</script>\n\n");

        output.push_str("<div>\n");
        output.push_str(&format!("  <h1>{}</h1>\n", self.name));
        output.push_str("</div>\n\n");

        output.push_str("<style>\n");
        output.push_str("</style>\n");

        output
    }

    /// Generate for target
    pub fn to_target(&self, target: VueTarget) -> String {
        match target {
            VueTarget::Vue2 => self.to_vue2(),
            VueTarget::Vue3 => self.to_vue3(),
            VueTarget::Svelte => self.to_svelte(),
        }
    }
}

fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        None => String::new(),
        Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
    }
}

/// Extract components from Omni code
pub fn extract_from_omni(code: &str) -> Vec<VueComponent> {
    let mut components = Vec::new();
    let mut current: Option<VueComponent> = None;

    for line in code.lines() {
        let trimmed = line.trim();

        if trimmed.starts_with("struct ") && (trimmed.contains("View") || trimmed.contains("Component")) {
            if let Some(comp) = current.take() {
                components.push(comp);
            }

            let name = trimmed[7..].split('{').next()
                .unwrap_or("Component")
                .trim()
                .to_string();

            current = Some(VueComponent::new(&name));
        }

        if let Some(ref mut comp) = current {
            if trimmed.contains(':') && !trimmed.starts_with("struct") && !trimmed.starts_with("fn") {
                let parts: Vec<&str> = trimmed.split(':').collect();
                if parts.len() >= 2 {
                    let name = parts[0].trim().to_string();
                    let prop_type = match parts[1].trim().trim_end_matches(',') {
                        "String" => "string",
                        "Int" => "number",
                        "Bool" => "boolean",
                        _ => "any",
                    };

                    comp.props.push(ComponentProp {
                        name,
                        prop_type: prop_type.to_string(),
                        required: !parts[1].contains('?'),
                        default: None,
                    });
                }
            }
        }

        if trimmed == "}" {
            if let Some(comp) = current.take() {
                components.push(comp);
            }
        }
    }

    components
}

/// Generate Vue/Svelte components
pub fn generate_vue(code: &str, target: VueTarget, output_dir: &Path) -> Result<()> {
    let target_name = match target {
        VueTarget::Vue2 => "Vue 2",
        VueTarget::Vue3 => "Vue 3",
        VueTarget::Svelte => "Svelte",
    };
    
    println!("{}", format!("🌿 Generating {} components...", target_name).cyan().bold());

    let components = extract_from_omni(code);
    
    for comp in &components {
        let filename = format!("{}.{}", comp.name, target.extension());
        let filepath = output_dir.join(&filename);
        let content = comp.to_target(target);
        
        fs::write(&filepath, content)?;
        println!("  {} {}", "✓".green(), filename);
    }

    println!("{} Generated {} components", "✓".green(), components.len());

    Ok(())
}
