/// <reference types="swift-rust/env" />

declare module "*.css" {
  const content: string;
  export default content;
}
