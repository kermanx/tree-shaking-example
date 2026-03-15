import JsYaml from 'js-yaml';

console.log(JsYaml.load(globalThis.process.env.YAML_STRING));
