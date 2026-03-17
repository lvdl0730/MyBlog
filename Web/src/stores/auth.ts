import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

export type UserRole = "admin" | "user" | "";

interface StoredAuthSession {
  nickname: string;
  avatar: string;
  email: string;
  role: UserRole;
}

interface LoginPayload {
  account: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

const AUTH_STORAGE_KEY = "blog-auth-session";

const guestSession: StoredAuthSession = {
  nickname: "游客",
  avatar: "",
  email: "",
  role: "",
};

const readStoredSession = (): StoredAuthSession => {
  if (typeof window === "undefined") return guestSession;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return guestSession;
    const parsed = JSON.parse(raw) as Partial<StoredAuthSession>;

    return {
      nickname: parsed.nickname || guestSession.nickname,
      avatar: parsed.avatar || "",
      email: parsed.email || "",
      role: parsed.role === "admin" || parsed.role === "user" ? parsed.role : "",
    };
  } catch {
    return guestSession;
  }
};

const buildNicknameFromAccount = (account: string) => {
  const base = account.includes("@") ? account.split("@")[0] ?? "" : account;
  return base.trim().slice(0, 16) || "用户";
};

const buildEmailFromAccount = (account: string) => {
  const normalized = account.trim();
  if (normalized.includes("@")) return normalized;
  return `${normalized}@example.com`;
};

export const useAuthStore = defineStore("auth", () => {
  const initialSession = readStoredSession();

  const nickname = ref(initialSession.nickname);
  const avatar = ref(initialSession.avatar);
  const email = ref(initialSession.email);
  const role = ref<UserRole>(initialSession.role);

  const isLogin = computed(() => !!role.value);
  const isAdmin = computed(() => role.value === "admin");

  const persistSession = () => {
    if (typeof window === "undefined") return;

    const payload: StoredAuthSession = {
      nickname: nickname.value,
      avatar: avatar.value,
      email: email.value,
      role: role.value,
    };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  };

  const applySession = (payload: StoredAuthSession) => {
    nickname.value = payload.nickname;
    avatar.value = payload.avatar;
    email.value = payload.email;
    role.value = payload.role;
  };

  const login = ({ account }: LoginPayload) => {
    const normalizedAccount = account.trim();
    const isAdminAccount = normalizedAccount.toLowerCase().includes("admin");
    const nextRole: UserRole = isAdminAccount ? "admin" : "user";
    const nextNickname =
      isAdminAccount && /^(admin|admin@)/i.test(normalizedAccount)
        ? "管理员"
        : buildNicknameFromAccount(normalizedAccount);

    applySession({
      nickname: nextNickname,
      avatar: "",
      email: buildEmailFromAccount(normalizedAccount),
      role: nextRole,
    });

    return nextRole;
  };

  const register = ({ username, email: nextEmail }: RegisterPayload) => {
    applySession({
      nickname: username.trim() || "新用户",
      avatar: "",
      email: nextEmail.trim(),
      role: "user",
    });
  };

  const mockLoginAsAdmin = () => {
    applySession({
      nickname: "管理员",
      avatar: "",
      email: "admin@example.com",
      role: "admin",
    });
  };

  const mockLoginAsUser = () => {
    applySession({
      nickname: "普通用户",
      avatar: "",
      email: "user@example.com",
      role: "user",
    });
  };

  const logout = () => {
    applySession(guestSession);
  };

  watch([nickname, avatar, email, role], persistSession, { immediate: true });

  return {
    nickname,
    avatar,
    email,
    role,
    isLogin,
    isAdmin,
    login,
    register,
    mockLoginAsAdmin,
    mockLoginAsUser,
    logout,
  };
});
