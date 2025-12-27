const UserProfile = ({ username, age, initialStatus }) => {
    const [status, setStatus] = useState(initialStatus);

    return (
        <div className="profile">
            <h2>{username} ({age})</h2>
            <p>Status: {status}</p>
        </div>
    );
}
