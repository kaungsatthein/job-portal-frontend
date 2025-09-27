import en from "@/messages/en.json";
import mm from "@/messages/mm.json";
import { notFound } from "next/navigation";

type Messages = typeof en;

const messagesMap: Record<string, Messages> = { en, mm };

export default function getMessages(locale: string) {
  const messages = messagesMap[locale];
  if (!messages) notFound();
  return messages;
}
