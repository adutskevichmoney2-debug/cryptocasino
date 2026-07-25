"use client";

import { useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Фото профиля: загрузка, предпросмотр, удаление.
 * Хранение: dataURL в localStorage (мок).
 * TODO(backend): загрузка в Supabase Storage (bucket avatars) + URL в profiles.
 */
export function AvatarUpload() {
  const { t } = useI18n();
  const { user, setAvatar } = useAuth();
  const toast = useUi((s) => s.toast);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast("error", t("common.error"), t("profile.avatarType"));
      return;
    }
    if (file.size > MAX_SIZE) {
      toast("error", t("common.error"), t("profile.avatarTooBig"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        // даунскейл до 256×256 (cover) → компактный dataURL
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        setAvatar(canvas.toDataURL("image/webp", 0.85));
        toast("success", t("profile.avatarSaved"));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="group relative">
        <Avatar username={user.username} src={user.avatar} size={84} />
        <button
          onClick={() => inputRef.current?.click()}
          aria-label={t("profile.changeAvatar")}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-page/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
        >
          <Camera size={22} className="text-ink" />
        </button>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
            <Camera size={14} />
            {user.avatar ? t("profile.changeAvatar") : t("profile.uploadNew")}
          </Button>
          {user.avatar && (
            <Button size="sm" variant="ghost" onClick={() => setAvatar(null)}>
              <Trash2 size={14} />
              {t("profile.remove")}
            </Button>
          )}
        </div>
        <p className="mt-2 text-[11.5px] text-mute">
          {t("profile.avatarType")} · {t("common.max")} 2 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
