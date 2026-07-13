
export const LOGIN_ROUTE = "/user/login"
export const SIGNUP_ROUTE = "/user/register"
export const CURRENT_USER_ROUTE = "/user/me"
export const UPDATE_PROFILE_ROUTE = "/user/update-profile"
export const USER_DETAIL_ROUTE = (id) => `/user/profile/${id}`

export const CREATE_BLOG = "/blog/create"
export const GET_ALL_ADMIN_BLOGS = "/blog/admin/all"
export const GET_ALL_BLOGS = "/blog/published/all-blogs"
export const UPLOAD_IMAGE = "/blog/upload-image"
export const TRENDING_BLOGS = "/blog/trending"
export const VIEW_INC = (id) => `/blog/${id}/view`
export const LIKE_BLOG = (blogId) => `/blog/${blogId}/like`
export const BLOGS_BY_CATEGORY = (category) => `/blog/category/${category}`
export const GET_SINGLE_BLOG = (slug) => `/blog/single/${slug}`
export const USER_BLOGS = (userId) => `/user/${userId}/blogs`
export const UPDATE_BLOG = (slug) => `/blog/update/${slug}`

export const CREATE_COMMENT = (blogId) => `/comments/post/${blogId}`
export const GET_BLOG_COMMENTS = (blogId) => `/comments/blog/${blogId}`

export const CREATE_BOOKMARK = (blogId) => `/bookmark/add/${blogId}`
export const DELETE_BOOKMARK = (blogId) => `/bookmark/delete/${blogId}`

export const BLOG_BOOKMARK = (blogId) => `/bookmark/blog/${blogId}`
export const CHECK_USER_BLOG_BOOKMARK = (blogId) => `/bookmark/user/${blogId}`

// admin routes

export const FEATURE_BLOG_ROUTE = (id) => `/admin/blog/${id}/feature`
export const ADMIN_TOGGLE_COMMENT_ROUTE = (id) => `/admin/blog/${id}/toggle-comments`
export const ADMIN_DELETE_ONE_BLOG = (id) => `/admin/blog/${id}/delete`
export const ADMIN_DELETE_MULTIPLE_BLOGS = `/admin/blog/delete`
export const ADMIN_STATS_ROUTE = "/admin/stats"
export const ADMIN_ALL_BLOGS_ROUTE = "/admin/blog/all"
export const ADMIN_PUBLISH_BLOG_ROUTE = (id) => `/admin/blog/${id}/publish`
export const ADMIN_UNPUBLISH_BLOG_ROUTE = (id) => `/admin/blog/${id}/unpublish`
export const ADMIN_TRENDING_BLOGS_ROUTE = "/admin/blog/trending"
export const ADMIN_RECENT_BLOGS_ROUTE = "/admin/blog/recent"

export const ADMIN_ALL_USERS_ROUTE = "/admin/users/all"
export const ADMIN_DELETE_ONE_USER_ROUTE = (id) => `/admin/users/${id}/delete`
export const ADMIN_DELETE_MULTIPLE_USERS_ROUTE = "/admin/users/delete"
export const ADMIN_GET_USER_DETAILS_ROUTE = (id) => `/admin/user/${id}/details`
export const ADMIN_BLOCK_USER_ROUTE = (id) => `/admin/user/${id}/block`
export const ADMIN_UNBLOCK_USER_ROUTE = (id) => `/admin/user/${id}/un-block`
export const ADMIN_GET_USER_BLOGS_ROUTE = (userId) => `/admin/user/${userId}/blogs`