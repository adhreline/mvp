'use client'
import { Avatar, Box, Button, Chip, Grid, TextField, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Markdown from "markdown-to-jsx"
import ReactMarkdown from "react-markdown"
import Image from 'next/image'
import { Clock4, Calendar, MapPin, ArrowRight, Copy, ChevronRight } from 'lucide-react'
import { toast } from "react-toastify"

const removeMarkdownComments = (text) => {
    if (!text) return ""

    return text.replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[\/\/\]:\s*#\s*\(.*?\)\s*/g, "")
    .replace(/\[\/\/\]:\s*<>\s*\(.*?\)\s*/g, "")
    .replace(/\[\/\/\]:\s*<.*?>\s*/g, "");
}

const extractHeadings = (markdown) => {
  const headingRegex = /^##\s+(.*)$/gm
  const headings = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push(match[1])
  }

  return headings
}

const BlogPage = () => {
  // const strapiApiUrl=process.env.NEXT_PUBLIC_STRAPI_URL
  const strapiApiUrl='https://strapi.adhreline.com'
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState<any>()
  const [featuredBlogs, setFeaturedBlogs] = useState<any>()
  const [author, setAuthor] = useState<any>()
  const router = useRouter()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const daySuffix =
      day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th"
    
    const month = date.toLocaleString("default", { month: "long" })
    const year = date.getFullYear()
    
    return `${day}${daySuffix} ${month}, ${year}`
  }

  useEffect(() => {
    if (!slug) return
    const fetchBlog = async () => {
      try{
        const response = await fetch(`${strapiApiUrl}/api/blogs?filters[slug][$eq]=${slug}&populate=*`)
        const data = await response.json()
        setBlog(data.data[0])
        console.log(data.data[0])
        setLoading(true)
      } catch (error) {
        console.log(error)
      }
    }

    fetchBlog()
  }, [slug])

  useEffect(() => {
    const fetchAuthor = async () => {
      if (blog) {
        try {
          const response = await fetch(`${strapiApiUrl}/api/authors?${blog.author.documentId}&populate=*`)
          const data = await response.json()
          setAuthor(data.data[0])
          setLoading(false)
        } catch (error) {
          console.log(error)
        }
      }
    }
        
    fetchAuthor()

    if (!blog) return

    const fetchSimilarBlogsData = async () => {
      try {
        const response = await fetch(`${strapiApiUrl}/api/blogs?filters[slug][$ne]=${slug}&filters[blog_category][slug][$eq]=${blog.blog_category.slug}&pagination[limit]=3&populate=*`)
        const data = await response.json()
        setFeaturedBlogs(data.data)
        setLoading(false)
      } catch(error) {
        console.log(error)
      }
    }
      
    fetchSimilarBlogsData()
  },[blog])

  const generateIdFromChildren = (children) => {
    const text = React.Children.map(children, child => {
      if (typeof child === 'string') return child
      if (typeof child === 'object' && child?.props?.children) {
        return generateIdFromChildren(child.props.children)
      }
      return ''
    }).join('')
        
    return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
  }

  const handleShare = () => {
    if (typeof window !== undefined && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("Copied to clipboard")
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error)
      })
    }
  }

  const handleClick = (param) => {
    if (param === "blogs") {
      router.push(`/resources?tab=${param}`);
    } else {
      router.push(`/resources?tab=blogs&category=${encodeURIComponent(blog?.category?.slug || '')}`)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "start", height: "100vh", pt: "150px" }} >
        <Box style={{ display: "flex",  height: "10vh", width: "10vh" }} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
            <path
              fill="none"
              stroke="#EF4444"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="300 385"
              strokeDashoffset="0"
              d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
            >
              <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur="2"
                values="685;-685"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </Box>
      </Box> 
    )
  }

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", display: "flex", flexDirection: { xs: "column", md: "row"}, px: { xs: 2, sm: "50px", md: "82px", lg: "120px" }, gap: { xs: "0px", md: "60px"} }} >
        <Box sx={{ width: { xs: "100%", md: "64%"}, maxWidth: "790px", display: "flex", flexDirection: "column" }} >
          <Box sx={{ whiteSpace: "nowrap", overflowX: "scroll", display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} >
            <Typography onClick={() => router.push("/")} component='p' sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              cursor: "pointer",
              color: "#6B7280"
            }} >
              Home
            </Typography>

            <ChevronRight size={18} style={{ flexShrink: 0 }} />

            <Typography component='p' onClick={() => router.push("/blogs")} sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              cursor: "pointer",
              color: "#6B7280"
            }} >
              Blog
            </Typography>

            <ChevronRight size={18} style={{ flexShrink: 0 }} />

            <Typography component='p' onClick={() => router.push(`/blogs`)} sx={{
              fontSize: "14px",
              cursor: "pointer",
              color: "#6B7280"
            }} >
              {blog?.blog_category.name}
            </Typography>

            <ChevronRight size={18} style={{ flexShrink: 0 }} />

            <Typography component='p' sx={{
              fontSize: "14px", color: "#111827", fontWeight: 500
            }} >
              {blog?.title}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mt: "40px", gap: "20px" }}>
            <Chip sx={{ 
              background: "#EF4444", 
              color: "#FFFFFF",
              height: "30px", 
              width: "fit-content",
              fontSize: "14px", 
              fontWeight: 700 
            }}
              label={blog.blog_category.name}
            />
            <Typography variant='h1' sx={{ fontSize: { xs: "24px", sm: "36px"}, fontWeight: 700, color: "rgba(0, 0, 0, 0.87)", lineHeight: { sm: "43px"} }} >
                {blog?.title}
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  {author?.profile_photo.formats.thumbnail.url.length > 0 && <Avatar src={`${strapiApiUrl}${author.profile_photo.formats.thumbnail.url}`} alt='profile-pic' sx={{ width: "30px", height: "30px" }} />}
                  <Typography component='p' sx={{ color: "#111827", fontSize: "13px", fontWeight: 500 }}>
                    {blog?.author?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar width={16} height={16} color='#6B7280' />
                  <Typography component='p' sx={{ color: "#6B7280", fontSize: "13px" }} >
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
                {blog?.reading_time && <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock4 width={16} height={16} color='#6B7280' />
                  <Typography component='p' sx={{ color: "#6B7280", fontSize: "13px" }} >{blog?.reading_time} Mins read</Typography>
                </Box>}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
                <Typography component='p' sx={{ color: "#6B7280", fontSize: "15px" }}>
                  Share:
                </Typography>

                <a href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.adhreline.com%2Fblogs%2F${slug}`} target="_blank" rel="noopener noreferrer">
                  <img src='/f-icon.svg' width={12} height={12} />
                </a>
                <a href={`https://twitter.com/intent/tweet?text=Check%20this%20out!%20https%3A%2F%2Fwww.adhreline.com%2Fblogs%2F${slug}`} target="_blank" rel="noopener noreferrer">
                  <img src='/x-icon.svg' width={18} height={18} />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.adhreline.com%2Fblogs%2F${slug}`} target="_blank" rel="noopener noreferrer">
                  <img src='/linkedin.svg' width={18} height={18} />
                </a>
                <img src='/share.svg' width={18} height={18} />
              </Box>
            </Box>

            <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: "20px" }}>
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "35px" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  {author?.profile_photo.formats.thumbnail.url.length > 0 && <Avatar src={`${strapiApiUrl}${author.profile_photo.formats.thumbnail.url}`} alt='profile-pic' sx={{ width: "30px", height: "30px" }} />}
                  <Typography component='p' sx={{ color: "#111827", fontSize: "13px", fontWeight: 500 }}>
                    {blog?.author?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar width={16} height={16} color='#6B7280' />
                  <Typography component='p' sx={{ color: "#6B7280", fontSize: "13px" }} >
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "54px" }}>
                {blog?.reading_time && <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock4 width={16} height={16} color='#6B7280' />
                  <Typography component='p' sx={{ color: "#6B7280", fontSize: "13px" }} >{blog?.reading_time} Mins read</Typography>
                </Box>}
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.adhreline.com%2Fblogs%2F${slug}`} target="_blank" rel="noopener noreferrer">
                    <img src='/f-icon.svg' width={12} height={12} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=Check%20this%20out!%20https%3A%2F%2Fwww.adhreline.com%2Fblogs%2F${slug}`} target="_blank" rel="noopener noreferrer">
                    <img src='/x-icon.svg' width={18} height={18} />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.adhreline.com%2Fblogs%2F${slug}`} target="_blank" rel="noopener noreferrer">
                    <img src='/linkedin.svg' width={18} height={18} />
                  </a>
                  <img src='/share.svg' width={18} height={18} />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            width: "100%", maxHeight: "500px", mt: "40px", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", overflow: "hidden",
            boxShadow: `0px 0px 0px 0px #00000000,
                          0px 0px 0px 0px #00000000,
                          0px 10px 15px -3px #0000001A,
                          0px 4px 6px -4px #0000001A`

          }}>
            <img src={`${strapiApiUrl}${blog.cover_image?.url}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Typography component='p' sx={{ color: "#6B7280", fontSize: "13px", textAlign: "center", mt: "10px" }}>
            {blog?.cover_image_subtitle}
          </Typography>
          <Box sx={{ mt: "32px", mb: "16px" }} >
            <Markdown
              options={{
                overrides: {
                  iframe: {
                    component: ({ ...props }) => (
                      <Box
                        component="iframe"
                        sx={{
                          width: "80%",
                          margin: "0 auto",
                          display: "block",
                          height: "360px",
                          my: "24px"
                        }}
                        {...props}
                      />
                    ),
                  },
                  img: {
                    component: ({ alt, src, ...props }) => {
                      return (
                        <img
                          src={src}
                          alt={alt}
                          style={{
                            width: "100%",
                            maxHeight: "360px",
                            objectFit: "contain",
                          }}
                          {...props}
                        />
                      );
                    },
                  },
                  h1: {
                    component: ({ children, ...props }) => {
                      const id = generateIdFromChildren(children);
                      return (
                        <Typography
                          variant="h1"
                          sx={{
                            fontSize: { xs: "1.17rem" },
                          }}
                          gutterBottom
                          id={id}
                          {...props}
                        >
                          {children}
                        </Typography>
                      );
                    },
                  },
                  h2: {
                    component: ({ children, ...props }) => {
                      const id = generateIdFromChildren(children);
                      return (
                        <Typography
                          variant="h2"
                          sx={{
                              fontSize: { xs: "1.5rem", xl: "1.7rem" },
                              fontWeight: 700,
                          }}
                          gutterBottom
                          id={id}
                          {...props}
                        >
                          {children}
                        </Typography>
                      );
                    },
                  },
                  h3: {
                    component: ({ children, ...props }) => {
                      const id = generateIdFromChildren(children);
                      return (
                        <Typography
                          variant="h3"
                          sx={{
                              fontSize: { xs: "1.1rem", xl: "1.1rem" },
                          }}
                          gutterBottom
                          id={id}
                          {...props}
                        >
                          {children}
                        </Typography>
                      );
                    },
                  },
                  p: {
                    component: (props) => (
                      <Typography variant="body1" sx={{ color: "#4B5563" }} paragraph {...props} />
                    ),
                  },
                  li: {
                    component: (props) => (
                      <Box
                        component="li"
                        sx={{ marginLeft: { xs: "5px", sm: "20px" } }}
                        {...props}
                      />
                    ),
                  },
                  blockquote: {
                    component: (props) => (
                      <Box
                        component="blockquote"
                        sx={{
                          width: "100%",
                          px: "16px",
                          py: "24px",
                          m: 0,
                          borderLeft: "4px solid #EF4444",
                          my: "20px",
                          backgroundColor: "#FFF7ED",
                          whiteSpace: "normal",
                          "& h1, & h2": {
                            color: "#EF4444",
                            margin: 0,
                            marginBottom: "8px",
                          },
                          "& p": {
                            color: "#374151",
                            margin: 0,
                          },
                          "& > *": { m: 0 },
                        }}
                        {...props}
                      />
                    ),
                  },
                  table: {
                    component: (props) => (
                      <Box
                        component="table"
                        sx={{
                          borderCollapse: "separate",
                          borderSpacing: 0,
                          width: "100%",
                          marginY: 6,
                          overflowX: "auto",
                          display: "block",
                          borderRadius: "10px",
                          overflow: "hidden",
                          borderBottom: "1px solid #B3B3B3"
                        }}
                        {...props}
                      />
                    ),
                  },
                  thead: {
                    component: (props) => (
                      <Box
                        component="thead"
                        // sx={{ backgroundColor: "#C8E1FF" }}
                        sx={{ backgroundColor: "#FECACA" }}
                        {...props}
                      />
                    ),
                  },
                  tbody: {
                    component: (props) => <Box component="tbody" {...props} />,
                  },
                  tr: {
                    component: (props) => (
                      <Box
                        component="tr"
                        sx={{ borderBottom: "1px solid #C8E1FF" }}
                        {...props}
                      />
                    ),
                  },
                  th: {
                    component: (props) => (
                      <Box
                        component="th"
                        sx={{
                            textAlign: "left",
                            padding: "16px",
                            fontWeight: "bold",
                            fontSize: "15px",
                            borderTop: "1px solid #B3B3B3",
                            borderRight: "1px solid #B3B3B3",
                            "&:first-of-type": { borderLeft: "1px solid #B3B3B3" },
                        }}
                        {...props}
                      />
                    ),
                  },
                  td: {
                    component: (props) => (
                      <Box
                        component="td"
                        sx={{
                          textAlign: "left",
                          px: "16px",
                          py: "8px",
                          fontSize: "14px",
                          borderTop: "1px solid #B3B3B3",
                          borderRight: "1px solid #B3B3B3",
                          "&:first-of-type": { borderLeft: "1px solid #B3B3B3" },
                        }}
                        {...props}
                      />
                    ),
                  },
                },
              }}
            >
              {removeMarkdownComments(blog?.content)}
            </Markdown>
          </Box>
        </Box>
        <Box sx={{ width: "36%", display: { xs: "none", md: "flex" }, flexDirection: "column", position: "sticky", top: "30%", alignSelf: "flex-start", gap: "28px" }} >
          <Box sx={{ height: "190px", display: "flex", flexDirection: "column", p: "24px", gap: "12px", maxWidth: "790px", background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: "16px" }}>
            <Typography component='p' sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
              Join our community
            </Typography>
            <Typography component='p' sx={{ fontSize: "15px", color: "#4B5563" }}>
              Get the latest adventure stories and deals.
            </Typography>
            <TextField required fullWidth placeholder='Email Address' sx={{ 
              background: "#FAFAFA", 
              "& .MuiInputBase-root": { 
                height: "40px", 
                minHeight: "32px", 
                borderRadius: "8px",
              },
              "& .MuiInputBase-input": {
              }
            }} />
            <Button sx={{
              boxShadow: `0px 0px 0px 0px #00000000,
                            0px 0px 0px 0px #00000000,
                            0px 1px 2px 0px #0000000D`,
              background: "#EF4444",
              borderRadius: "100px",
              textTransform: "none"
            }}>
              <Typography component='p' sx={{
                fontWeight: 500,
                color: "#FFFFFF"
              }}>
                Subscribe
              </Typography>
            </Button>
          </Box>

          <Box sx={{ mt: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography component='p' sx={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>
              Popular Tags
            </Typography>
            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {blog?.tags.map((tag,ind) => (
                <Chip sx={{ 
                  background: "#F3F4F6", 
                  color: "#4B5563",
                  height: "34px", 
                  width: "fit-content",
                  fontSize: "13px",
                }}
                  label={`#${tag.name}`}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", px: { xs: 2, md: "150px"}, display: "flex", flexDirection: "column", alignItems: "center", pt: "54px" }} >
        <Box sx={{ width: "100%", alignItems: "center", justifyContent: "space-between", display: "flex" }}>
          <Typography component='p' sx={{ fontSize: "22px", fontWeight: 700 }} >
            You might also like
          </Typography>
          <Typography component='p' onClick={() => router.push(`/blogs`)} sx={{ 
            color: "#EF4444", fontWeight: 500, cursor: "pointer" 
          }}>
            View all stories
          </Typography>
        </Box>
        <Box sx={{ py: "24px", width: "100%", display: "flex", flexDirection: "row", gap: "17px", justifyContent: "center", flexWrap: "wrap" }} >
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {featuredBlogs?.map((blog,ind) => (
              // @ts-ignore
              <Grid key={blog.slug} item size={{ xs: 12, md: 4 }} sx={{ width: "100%" }}>
                <Box onClick={() => router.push(`/blogs/${blog?.slug}`)} sx={{ 
                  cursor: "pointer", 
                  bgcolor: "#fff",
                  display: "flex", 
                  width: "100%",
                  flexDirection: "column", 
                  height: "480px", 
                  borderRadius: "16px",
                  alignItems: "center",
                  border: "1px solid #F3F4F6",
                  overflow: "hidden",
                }} >
                  <Box sx={{ height: 215, width: "100%", position: "relative" }}>
                    {blog?.cover_image.url && <Box component="img" src={`${strapiApiUrl}${blog.cover_image.url}`}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: 215,
                        objectFit: "cover",
                        zIndex: 1,
                      }}
                    />}
                    <Box sx={{
                      position: "absolute",
                      inset: 0,
                      height: 215,
                      background: "linear-gradient(360deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 100%)",
                      zIndex: 1,
                    }}/>

                    <Box sx={{ position: "absolute", py: "16px", px: "16px", zIndex: 3, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip sx={{ 
                        background: "#FFFFFFE5", 
                        color: "#464646",
                        height: "30px", 
                        fontSize: "13px",
                        fontWeight: 700 
                      }}
                        label={`${blog.blog_category?.name}`}
                      />

                      {blog.is_trending && <Box sx={{
                        background: "#EF4444",
                        boxShadow: '0px 1px 2px 0px #0000000D',
                        height: "30px",
                        borderRadius: "4px",
                        width: "fit-content",
                        display: "flex",
                        px: "8px",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Typography component='p' sx={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 700 }}>
                          Trending
                        </Typography>
                      </Box>}
                    </Box>
                  </Box>
                                    
                  <Box sx={{ flex: 1, p: "24px", display: "flex", flexDirection: "column", gap: "13px", justifyContent: "end" }} >
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "24px", width: "100%", alignItems: "center" }}>
                      {blog?.location && <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin width={14} height={14} color='#EF4444' />
                        <Typography component='p' sx={{ color: "#6B7280", fontSize: "12px" }}>
                          {blog.location}
                        </Typography>
                      </Box>}
                      {blog?.reading_time && <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock4 width={14} height={14} color='#4A90E2' />
                        <Typography component='p' sx={{ color: "#6B7280", fontSize: "12px" }}>
                          {blog.reading_time} min read
                        </Typography>
                      </Box>}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }} >
                      <Typography component='p' sx={{ color: "#111827", fontWeight: 700, fontSize: "18px", lineHeight: "28px", letterSpacing: "0%" }} >
                        {blog.title}
                      </Typography>
                      <Typography component='p' sx={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", color: "#4B5563", fontWeight: 400, fontSize: "13px", lineHeight: "22px", letterSpacing: "0%" }} >
                        {blog.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar width={14} height={14} color='#9CA3AF' />
                        <Typography component='p' sx={{ color: "#9CA3AF", fontWeight: 500, fontSize: "12px" }}>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Typography component='p' sx={{ color: "#EF4444", fontWeight: 700, fontSize: "14px" }}>
                          Read story
                        </Typography>
                        <ArrowRight width={20} height={20} color='#EF4444' />
                      </Box>
                    </Box>
                  </Box>
                  </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default BlogPage