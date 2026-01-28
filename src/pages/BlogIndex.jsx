import BlogNavbar from '../components/BlogNavbar'

const BlogIndex = () => {
  return (
    <>
      <BlogNavbar />
      <main className="blog-page">
        <div className="blog-container">
          <h1>Blog</h1>
          <p className="blog-placeholder">
            Blog posts coming soon. Check back later!
          </p>
        </div>
      </main>
    </>
  )
}

export default BlogIndex
