function ProfilePage({ user }) {
    return (
        <main>

            <h2>Profile</h2>

            <div className="profile-card">

                <h3>Your Account</h3>

                <p>
                    <strong>Email:</strong> {user?.email}
                </p>

            </div>

        </main>
    );
}

export default ProfilePage;