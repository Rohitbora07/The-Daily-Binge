
export const LOGIN_ROUTE = "/user/login"
export const SIGNUP_ROUTE = "/user/register"
export const CURRENT_USER_ROUTE = "/user/me"
export const UPDATE_PROFILE_ROUTE = "/user/update-profile"
export const USER_DETAIL_ROUTE = (userId) => `/user/profile/${userId}`

export const CREATE_BLOG = "/blog/create"
export const GET_ALL_ADMIN_BLOGS = "/blog/admin/all"
export const GET_ALL_BLOGS = "/blog/published/all-blogs"
export const UPLOAD_IMAGE = "/blog/upload-image"
export const VIEW_INC = (id) => `/blog/${id}/view`
export const LIKE_BLOG = (blogId) => `/blog/${blogId}/like`
export const BLOGS_BY_CATEGORY = (category) => `/blog/category/${category}`
export const GET_SINGLE_BLOG = (slug) => `/blog/${slug}`
export const USER_BLOGS = (userId) => `/user/${userId}/blogs`

export const CREATE_COMMENT = (blogId) => `/comments/post/${blogId}`
export const GET_BLOG_COMMENTS = (blogId) => `/comments/blog/${blogId}`