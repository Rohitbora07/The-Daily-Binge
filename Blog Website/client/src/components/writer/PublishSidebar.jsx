import { Send, FileText, MessageSquare, Globe, Lock } from "lucide-react";
import TagInput from "./TagInput";
import Select from "./OptionSelect";

const categories = ["AI", "Animation", "Anime", "Art", "Astronomy", "Adventure", "Books", "Business", "Basketball", "Baseball", "Boxing", "Beauty", "Biography", "Comics", "Cartoons", "Cinema", "Celebrity", "Cricket", "Cars", "Culture", "Cooking", "Design", "Drama", "Documentaries", "DIY", "Digital Culture", "Data Science", "Entertainment", "Esports", "Education", "Environment", "Economics", "Exploration", "Engineering", "Fashion", "Food", "Fitness", "Football", "Formula 1", "Finance", "Fantasy", "Gaming", "Gadgets", "Geography", "Government", "Green Living", "Graphic Design", "Gardening", "Health", "History", "Hollywood", "Horror", "Home & Living", "Hiking", "Humor", "Internet", "Innovation", "Influencers", "India", "Investment", "Interviews", "Indie", "Journalism", "Japan", "Jobs", "Justice", "Jazz", "K-Pop", "Korean Culture", "Knowledge", "Kickboxing", "Kitchen", "Lifestyle", "Literature", "Linux", "Leadership", "Law", "Luxury", "Local News", "Movies", "Music", "Manga", "Marvel", "Memes", "Mobile", "Mythology", "Nature", "News", "Netflix", "Nutrition", "Nintendo", "Novels", "Neuroscience", "OTT", "Olympics", "Open Source", "Ocean", "Outdoors", "Opinion", "Pop Culture", "Programming", "Photography", "Psychology", "Politics", "Podcasts", "Physics", "Philosophy", "Quantum Computing", "Quantum Physics", "Quizzes", "Quotes", "Q&A", "Quick Reads", "Reviews", "Robotics", "Recipes", "Racing", "Reality TV", "Renewable Energy", "Religion", "Sports", "Science", "Space", "Smartphones", "Startups", "Streaming", "Software", "Superheroes", "Technology", "TV Shows", "Travel", "Tennis", "Tutorials", "True Crime", "Tourism", "UFC", "Universities", "Urban Culture", "Universe", "Updates", "User Stories", "Video Games", "Virtual Reality", "Visual Arts", "Vehicles", "Viral Trends", "Volleyball", "Vegan", "Web Series", "WWE", "Wildlife", "World News", "Wearables", "Wellness", "Web Development", "Xbox", "X-Men", "X-Factor", "YouTube", "Yoga", "Youth Culture", "Young Adult", "Zoology", "Zoos","Zero Waste", "Zodiac"]

export default function PublishSidebar({ onPublish, setCategory, category, setVisibility, visibility, setAllowComments, allowComments, tags, setTags }) {
    
    

    return (
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-[72px] space-y-5">

                {/* Publish actions */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-stone-800 mb-4">
                        Publish
                    </h3>

                    <div className="space-y-3">
                        <button
                            onClick={() => onPublish({ status: "published" })}
                            className="w-full flex items-center justify-center gap-2 bg-[#0077CC] hover:bg-[#005FA3] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors duration-200"
                        >
                            <Send size={15} />
                            Publish now
                        </button>

                        <div className="flex gap-2.5">
                            <button
                                onClick={() => onPublish({ status: "draft" })}
                                className="flex-1 flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-xl border border-stone-200 transition-colors"
                            >
                                <FileText size={14} />
                                Save draft
                            </button>

                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-5">
                    <h3 className="text-sm font-semibold text-stone-800">Settings</h3>

                    <Select
                        label="Category"
                        value={category}
                        onChange={setCategory}
                        options={categories}
                    />

                    <Select
                        label="Visibility"
                        value={visibility}
                        onChange={setVisibility}
                        options={["public", "private"]}
                    />
                    <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-xl border border-stone-100">
                        {visibility === "public" ? (
                            <Globe size={14} className="text-[#0077CC] mt-0.5 flex-shrink-0" />
                        ) : (
                            <Lock size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-xs text-stone-500 leading-relaxed">
                            {visibility === "public"
                                ? "This post will be visible to everyone on the internet."
                                :  "Only you can see this post. It won't appear publicly."}
                        </p>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            placeholder="my-blog-post-title"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all font-mono"
                        />
                    </div> */}

                    {/* Allow comments toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={15} className="text-stone-400" />
                            <span className="text-sm font-medium text-stone-700">
                                Allow comments
                            </span>
                        </div>
                        <button
                            onClick={() => setAllowComments(!allowComments)}
                            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${allowComments ? "bg-[#0077CC]" : "bg-stone-200"
                                }`}
                            style={{ height: "22px", width: "40px" }}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${allowComments ? "translate-x-[18px]" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>

                    
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-stone-800 mb-4">Tags</h3>
                    <TagInput tags={tags} setTags={setTags} />
                </div>

            </div>
        </aside>
    );
}