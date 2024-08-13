function containsForbiddenWords(username) {
    const forbiddenWords = [
        "admin", "root", "system",
        "select", "drop", "insert", "delete",
        "<script>", "alert", "kill", "suicide",
        "murder", "nazi", "klan",
        "f***", "s***", "b****", "c***",
        "a******", "p***", "d***", "sex",
        "porn", "xxx", "@example.com"
    ];

    // Normalize the username to lower case for case-insensitive comparison
    const lowerUsername = username?.toLowerCase();

    for (let word of forbiddenWords) {
        if (lowerUsername?.includes(word)) {
            return true;
        }
    }

    return false;
}

export function validateUsername(username) {
    const regex = /^[a-zA-Z0-9_-]{3,20}$/;

    if (!regex.test(username)) {
        return false;
    }

    if (containsForbiddenWords(username)) {
        return false;
    }

    return true;
}