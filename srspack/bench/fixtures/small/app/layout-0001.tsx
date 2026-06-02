import "./layout-0001.css";

export default function Layout0001({ children }) {
  return (
    <div className="layout-0001">
      <header>Layout 0001</header>
      <main>{children}</main>
      <footer>End of layout 0001</footer>
    </div>
  );
}
