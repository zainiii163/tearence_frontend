import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getBlogDetails } from '../../slice/ListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IoCalendarOutline, IoTimeOutline, IoArrowBack, IoShareSocialOutline } from 'react-icons/io5';

const BlogDetails = () => {
  const {id} = useParams()
  const dispatch = useDispatch();
  const blogDetails = useSelector((store) => store?.ads?.blogDetails);

  console.log("blogDetails",blogDetails)
  
  useEffect(() => {
    if (id) {
      dispatch(getBlogDetails({ id }));
    }
  }, [id]);

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80";

  if (!blogDetails?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="aspect-[16/9] bg-muted rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-16">
        {/* Back Button */}
        <Link 
          to="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <IoArrowBack className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            {blogDetails?.data?.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <IoCalendarOutline className="w-4 h-4" />
              <span>{new Date(blogDetails?.data?.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoTimeOutline className="w-4 h-4" />
              <span>5 min read</span>
            </div>
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <IoShareSocialOutline className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8 bg-muted">
          <img
            src={blogDetails?.data?.image || defaultImageUrl}
            alt={blogDetails?.data?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-foreground leading-relaxed [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-foreground [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-foreground [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:text-foreground [&>p]:mb-4 [&>p]:text-foreground [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2 [&>li]:text-foreground [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>blockquote]:my-6 [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6 [&>a]:text-primary [&>a]:hover:underline"
            dangerouslySetInnerHTML={{ __html: blogDetails?.data?.content }} 
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Published on {new Date(blogDetails?.data?.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Share Article
              </button>
            </div>
          </div>
        </footer>

        {/* Related Articles CTA */}
        <div className="mt-16 p-6 bg-muted/50 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Enjoyed this article?
          </h3>
          <p className="text-muted-foreground mb-4">
            Discover more insights and stories from our blog.
          </p>
          <Link 
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogDetails;
