"use client";

import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { JSX, ReactNode, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  applications,
  type Actor,
  type Application,
  type Stage,
  type TimelineEntry,
} from "../data";

const applicationsList = applications;

const stageStyles: Record<
  Stage,
  { badge: string; dot: string; progress: string }
> = {
  applied: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
    progress: "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600",
  },
  reviewing: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    progress: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600",
  },
  interview: {
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    progress: "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500",
  },
  offer: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    progress:
      "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600",
  },
  declined: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    progress: "bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600",
  },
};

const actorStyles: Record<Actor, string> = {
  recruiter: "bg-primary/10 text-primary",
  researcher: "bg-muted text-muted-foreground",
  system: "bg-secondary text-secondary-foreground",
};

const actorIcon: Record<Actor, JSX.Element> = {
  recruiter: <MessageSquare className="h-3.5 w-3.5" />,
  researcher: <Sparkles className="h-3.5 w-3.5" />,
  system: <CheckCircle2 className="h-3.5 w-3.5" />,
};

const stageFilters: (Stage | "all")[] = [
  "all",
  "applied",
  "reviewing",
  "interview",
  "offer",
  "declined",
];

export const ApplicationStatusBoard = ({ locale }: { locale: string }) => {
  const t = useTranslations("ApplicationStatus");
  const [filter, setFilter] = useState<(typeof stageFilters)[number]>("all");

  const filteredApplications = useMemo(
    () =>
      filter === "all"
        ? applicationsList
        : applicationsList.filter((app) => app.stage === filter),
    [filter]
  );

  const awaitingRecruiter = useMemo(
    () =>
      applicationsList.filter((app) => app.nextStep.owner === "recruiter")
        .length,
    []
  );
  const awaitingResearcher = useMemo(
    () =>
      applicationsList.filter((app) => app.nextStep.owner === "researcher")
        .length,
    []
  );

  return (
    <div className="mx-4 my-6 space-y-6 lg:mx-8">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit rounded-full">
          {t("badge")}
        </Badge>
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full border-dashed">
              {t("summary.activeLabel", { count: applicationsList.length })}
            </Badge>
            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/70 px-3 py-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>
                {t("summary.updatedLabel", {
                  time: "30s",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<CalendarClock className="h-4 w-4 text-primary" />}
          label={t("summary.awaitingRecruiter")}
          value={`${awaitingRecruiter} ${t("summary.items")}`}
          tone="primary"
        />
        <SummaryCard
          icon={<Sparkles className="h-4 w-4 text-primary" />}
          label={t("summary.awaitingYou")}
          value={`${awaitingResearcher} ${t("summary.items")}`}
          tone="primary"
        />
        <SummaryCard
          icon={<Briefcase className="h-4 w-4 text-primary" />}
          label={t("summary.interviewing")}
          value={`${
            applicationsList.filter((a) => a.stage === "interview").length
          } ${t("summary.items")}`}
          tone="primary"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          label={t("summary.offers")}
          value={`${
            applicationsList.filter((a) => a.stage === "offer").length
          } ${t("summary.items")}`}
          tone="primary"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-3 shadow-sm">
        {stageFilters.map((stage) => (
          <Button
            key={stage}
            variant={stage === filter ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full",
              stage === filter ? "shadow-sm" : "bg-background"
            )}
            onClick={() => setFilter(stage)}
          >
            {stage === "all" ? t("filters.all") : t(`stage.${stage}`)}
          </Button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              stageLabel={t(`stage.${application.stage}`)}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "primary" | "amber" | "emerald";
}) => {
  const toneStyles: Record<"primary" | "amber" | "emerald", string> = {
    primary: "from-primary/10 via-primary/5 to-background",
    amber: "from-amber-100 via-amber-50 to-background",
    emerald: "from-emerald-100 via-emerald-50 to-background",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br p-4 shadow-sm",
        toneStyles[tone]
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/70 shadow-sm">
            {icon}
          </div>
          <span className="font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
};

const ApplicationCard = ({
  application,
  stageLabel,
  locale,
}: {
  application: Application;
  stageLabel: string;
  locale: string;
}) => {
  const t = useTranslations("ApplicationStatus");
  const { badge, progress } = stageStyles[application.stage];
  const completed = application.timeline.filter(
    (item) => item.state === "done"
  ).length;
  const progressPercent = Math.round(
    (completed / application.timeline.length) * 100
  );

  return (
    <Link
      href={`/${locale}/application-status/${application.id}`}
      className="block"
      prefetch={false}
    >
      <Card className="border-border/80 bg-card/80 transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="gap-3 border-b border-border/60 pb-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold",
                    badge
                  )}
                >
                  {stageLabel}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {application.lastUpdate}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground md:text-base">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>
                  {application.role}
                  <span className="text-muted-foreground">
                    {" "}
                    · {application.company}
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {application.location}
              </p>
              <p className="text-sm text-foreground">{application.summary}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                <span>{t("progress")}</span>
                <span className="font-semibold text-foreground">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 w-48 rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", progress)}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>
                  {t("waitingOn", {
                    actor:
                      application.nextStep.owner === "recruiter"
                        ? t("timeline.recruiter")
                        : t("timeline.researcher"),
                  })}
                </span>
              </div>
              <Badge variant="outline" className="rounded-full border-dashed">
                {t("nextStepDue", { time: application.nextStep.due })}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-semibold text-foreground">
                {t("nextStep")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>{application.nextStep.label}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            {application.timeline.map((item, index) => (
              <TimelineItem
                key={`${application.id}-${item.title}`}
                item={item}
                isLast={index === application.timeline.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const TimelineItem = ({
  item,
  isLast,
}: {
  item: TimelineEntry;
  isLast: boolean;
}) => {
  const t = useTranslations("ApplicationStatus");
  return (
    <div className="relative flex gap-3 pb-4">
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-sm",
            actorStyles[item.actor]
          )}
        >
          {actorIcon[item.actor]}
        </div>
        {!isLast && (
          <div className="absolute top-7 h-full w-px bg-border" aria-hidden />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-full border-dashed">
            {item.actor === "recruiter"
              ? t("timeline.recruiter")
              : item.actor === "researcher"
              ? t("timeline.researcher")
              : t("timeline.system")}
          </Badge>
          <span className="text-xs text-muted-foreground">{item.time}</span>
          {item.state === "done" ? (
            <Badge
              variant="secondary"
              className="rounded-full bg-emerald-50 text-emerald-700"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              {t("timeline.completed")}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="rounded-full bg-amber-50 text-amber-700"
            >
              <Clock className="mr-1 h-3.5 w-3.5" />
              {t("timeline.active")}
            </Badge>
          )}
        </div>
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
    <CalendarClock className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);
