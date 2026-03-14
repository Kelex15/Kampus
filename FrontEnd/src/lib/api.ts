export interface AuthUser {
    id: string;
    email: string;
    name: string;
    username: string;
    university: string;
    currentYear: number;
    token: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface SignupPayload {
    email: string;
    password: string;
    school: string;
    username: string;
    currentYear: number;
    firstName?: string;
    lastName?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ── Force dev mode: set to true to bypass API calls ──
// Flip this to false when your backend CORS is fixed and ready
const DEV_MODE = true;

function createMockUser(overrides: Partial<AuthUser> = {}): AuthUser {
    return {
        id: "dev-user-" + Math.random().toString(36).slice(2, 8),
        email: "dev@university.edu",
        name: "Dev Student",
        username: "dev_student",
        university: "Demo University",
        currentYear: 2,
        token: "dev-token-" + Date.now(),
        ...overrides,
    };
}

export async function loginRequest(payload: LoginPayload): Promise<AuthUser> {
    if (DEV_MODE) {
        await new Promise((r) => setTimeout(r, 600));
        return createMockUser({ email: payload.email, name: payload.email.split("@")[0] });
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
    }

    return res.json();
}

export async function signupRequest(payload: SignupPayload): Promise<AuthUser> {
    if (DEV_MODE) {
        await new Promise((r) => setTimeout(r, 800));
        return createMockUser({
            email: payload.email,
            username: payload.username,
            university: payload.school,
            currentYear: payload.currentYear,
            name:
                [payload.firstName, payload.lastName].filter(Boolean).join(" ") ||
                payload.username,
        });
    }

    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Signup failed");
    }

    return res.json();
}

export function saveAuth(user: AuthUser) {
    if (typeof window !== "undefined") {
        localStorage.setItem("kampus_user", JSON.stringify(user));
        localStorage.setItem("kampus_token", user.token);
    }
}

export function getAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("kampus_user");
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("kampus_token");
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("kampus_user");
        localStorage.removeItem("kampus_token");
    }
}

export function isAuthenticated(): boolean {
    return !!getToken();
}