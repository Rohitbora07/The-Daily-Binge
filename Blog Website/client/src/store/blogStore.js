import {create} from "zustand"
import api from "../api/axios"
import { GET_ALL_BLOGS } from "../constants/route"

export const useBlogStore = create((set) => ({
    blogs: [],
    // trendingBlogs: [],
    // latestBlogs: [],

    blogLoading: false,
    // trendingLoading: false,
    // latestLoading: false,

    getAllBlogs: async () => {
        try {
            set({blogLoading: true})
            const {data} = await api.get(GET_ALL_BLOGS)

            set({
                blogs: data.blogs,
                blogLoading: false
            })
        } catch (error) {
            console.log(error)
            set({blogLoading: false})
        }
    },


}))