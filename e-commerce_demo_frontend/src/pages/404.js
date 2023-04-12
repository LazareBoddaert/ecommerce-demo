import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error">
      <h1 className="error-title">404 - Page Not Found</h1>
      <p className="error-content">Sorry, we cound't find the page you are looking for...</p>
      <Link href={'/'}>
        <button type='button' className="btn error-btn" >Return to homepage</button>
      </Link>
    </div>
  )
}
