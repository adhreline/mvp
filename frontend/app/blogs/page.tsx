'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Chip, Grid, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material'
import { Clock4, ArrowRight, MapPin, Calendar } from 'lucide-react'

const pageStyle = { width: "100%", px: { xs: 2, sm: "50px", md: "152px"} }

const Blogs = () => {
    const strapiApiUrl=process.env.NEXT_PUBLIC_STRAPI_URL
    const router = useRouter()
    const [blogs, setBlogs] = useState([])
    const [blogsSelected, setBlogsSelected] = useState<any>()
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate()        
        const month = date.toLocaleString("default", { month: "long" })
        const year = date.getFullYear()
        
        return `${month} ${day}, ${year}`
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true)
            try {
                const baseUrl = `${strapiApiUrl}/api/blogs`
                const response = await fetch(`${baseUrl}?populate[cover_image]=true&populate[blog_category]=true`)
                const data = await response.json()
                setBlogs(data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        };

        fetchBlogs()
    }, [])

  return (
    <div>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100vw", background: "#F9FAFB", py: "42px", my: "-32px" }} >
        {loading ? 
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "start", height: "100vh" }} >
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
            </Box> :
            <Box sx={pageStyle} >
                <Box sx={{ width: "100%", gap: "22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} >
                    {blogs[0] && <Box onClick={() => router.push(`/blogs/${blogs[0]?.slug}`)}
                        sx={{ position: "relative",
                        bgcolor: "#fff", 
                        maxWidth: "1200px",
                        width: "100%",
                        height: { xs: "500px", sm: "400px"}, 
                        borderRadius: "24px", py: "9px", px: "8px", gap: "16px", 
                        display: "flex", flexDirection: { xs: "column", sm: "row" }, overflow: "hidden",
                        boxShadow: `0px 0px 0px 0px #00000000, 0px 0px 0px 0px #00000000, 0px 25px 50px -12px #00000040`,
                    }} >
                        {blogs[0]?.cover_image.url && <Box component="img" src={`${strapiApiUrl}${blogs[0].cover_image.url}`} alt={blogs[0]?.cover_image.name}
                            sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                zIndex: 1,
                            }}
                        />}
    
                        <Box sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(0,0,0,0.3)",
                            // background: "linear-gradient(360deg, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.28) 50%, rgba(0, 0, 0, 0.28) 100%)",
                            zIndex: 1,
                        }}/>
                        <Box
                            sx={{
                                position: "relative",
                                zIndex: 2,
                                mt: "auto", px: { xs: "32px", sm: "48px" }, py: "28px",
                                color: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                maxWidth: { xs: "100%", sm: "70%"},
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {blogs[0].is_featured_week && 
                                <Chip sx={{ 
                                    background: "#EF4444", 
                                    color: "#FFFFFF",
                                    height: "30px", 
                                    fontSize: "14px", 
                                    fontWeight: 700 
                                }}
                                    label='Featured This Week'
                                />}

                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Clock4 width={14} height={14} color='#D1D5DB' />
                                    <Typography component='p' sx={{ color: "#D1D5DB", fontSize: "12px" }}>
                                        {blogs[0].reading_time} min read
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography component='p'
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: { xs: "auto", sm: "48px" },
                                    fontSize: { xs: "25px", md: "40px" },
                                }}
                            >
                                {blogs[0]?.title}
                            </Typography>

                            <Typography component='p'
                                sx={{
                                    fontWeight: 400,
                                    fontSize: { xs: "14px", md: "15px" },
                                    lineHeight: { xs: "auto", sm: "28px" },
                                    color: "#E5E7EB"
                                }}
                            >
                                {blogs[0]?.description}
                            </Typography>
                            
                            <Button sx={{
                                width: "fit-content",
                                background: "#EF4444",
                                borderRadius: "57px",
                                boxShadow: `0px 0px 0px 0px #00000000,
                                            0px 0px 0px 0px #00000000,
                                            0px 1px 2px 0px #0000000D`,
                                py: "12px", px: "24px", textTransform: "none", gap: "9px",
                                mt: "10px"
                            }}>
                                <Typography component='p' sx={{
                                    color: "#FFFFFF", fontWeight: 500, fontSize: "15px",
                                }}>
                                    Read Full Story
                                </Typography>
                                <ArrowRight width={20} height={20} color='#FFFFFF' />
                            </Button>
                        </Box>
                    </Box>}

                    <Typography component='p' sx={{ mt: "28px", mb: "14px", textAlign: "start", width: "100%", color: "#111827", fontSize: "24px", fontWeight: 700 }}>
                        Latest Stories
                    </Typography>

                    <Grid container spacing={2} sx={{ width: "100%" }}>
                        {blogs?.slice(1).map((blog,ind) => (
                            // @ts-ignore
                            <Grid key={blog.slug} item size={{ xs: 12, md: 4, width: "100%" }}>
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
                                                    {blog?.location}
                                                </Typography>
                                            </Box>}
                                            {blog?.reading_time && <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Clock4 width={14} height={14} color='#4A90E2' />
                                                <Typography component='p' sx={{ color: "#6B7280", fontSize: "12px" }}>
                                                    {blog?.reading_time} min read
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
        }
        </Box>
    </div>
  )
}

export default Blogs