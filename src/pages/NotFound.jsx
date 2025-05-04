import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container-custom text-center">
        <div>
          <div className="text-9xl font-bold text-orange-500 mb-4">404</div>

          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>

          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <Link to="/" className="btn-primary inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
