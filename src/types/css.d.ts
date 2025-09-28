// side-effect global CSS imports like: import './globals.css'
declare module '*.css';

// optional: CSS Modules ke liye
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
