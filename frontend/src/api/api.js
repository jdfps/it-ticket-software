const API_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {})
{
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok)
    {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.detail || "Something went wrong."
        );
    }

    return response.json();
}


// AUTH

export function login(email, password)
{
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export function setPassword(userId, newPassword)
{
    return request("/auth/set-password", {
        method: "PUT",
        body: JSON.stringify({
            user_id: userId,
            new_password: newPassword,
        }),
    });
}


// USERS

export function createUser(user)
{
    return request("/users", {
        method: "POST",
        body: JSON.stringify(user),
    });
}

export function getUsers(role = null)
{
    const query = role ? `?role=${role}` : "";

    return request(`/users${query}`);
}


// CATEGORIES

export function getCategories()
{
    return request("/categories");
}


// TICKETS

export function createTicket(ticket)
{
    return request("/tickets", {
        method: "POST",
        body: JSON.stringify(ticket),
    });
}

export function getTickets(filters = {})
{
    const params = new URLSearchParams();

    if (filters.status)
    {
        params.append(
            "ticket_status",
            filters.status
        );
    }

    if (filters.userId)
    {
        params.append(
            "user_id",
            filters.userId
        );
    }

    if (filters.techId)
    {
        params.append(
            "tech_id",
            filters.techId
        );
    }

    const query = params.toString();

    return request(
        `/tickets${query ? `?${query}` : ""}`
    );
}

export function approveTicket(ticketId, priority)
{
    return request(`/tickets/${ticketId}/approve`, {
        method: "PATCH",
        body: JSON.stringify({
            priority,
        }),
    });
}

export function rejectTicket(ticketId)
{
    return request(`/tickets/${ticketId}/reject`, {
        method: "PATCH",
    });
}

export function claimTicket(ticketId, techId)
{
    return request(`/tickets/${ticketId}/claim`, {
        method: "PATCH",
        body: JSON.stringify({
            tech_id: techId,
        }),
    });
}

export function resolveTicket(ticketId, techId)
{
    return request(`/tickets/${ticketId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({
            tech_id: techId,
        }),
    });
}


// COMMENTS

export function getComments(ticketId)
{
    return request(`/tickets/${ticketId}/comments`);
}

export function createComment(
    ticketId,
    authorId,
    commentText
)
{
    return request(`/tickets/${ticketId}/comments`, {
        method: "POST",
        body: JSON.stringify({
            author_id: authorId,
            comment_text: commentText,
        }),
    });
}