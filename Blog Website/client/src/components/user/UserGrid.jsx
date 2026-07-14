import UserCard from "./UserCard";
function UserGrid({ users, sliceLimit }) {
    users = users.slice(0, sliceLimit || users.length)
    return (
        <section className="mb-16">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user, i) => (
                    <UserCard key={i} user={user} index={i} />
                ))}
            </div>
        </section>
    );
}

export default UserGrid;