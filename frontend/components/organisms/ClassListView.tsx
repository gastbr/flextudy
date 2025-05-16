"use client"
import { useState } from "react"
import ClassListViewCard from "../molecules/ClassListViewCard"


interface LessonProp {
  lessons: {
    id: number,
    title: string,
    start_time: string
    end_time: string
    lesson_url: string
    spots: string,
    teacher_username: string,
    teacher_name: string,
    status?: string,
  }[];
  getDashboard: () => void;
  currentUser?: { username: string; user_type_name: string }; // add currentUser prop
}

export default function ClassListView({ lessons, getDashboard, currentUser }: LessonProp) {
  const [id, setId] = useState<number>(0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  lessons.sort((a, b) => {
    const dateA = new Date(a.start_time).getTime();
    const dateB = new Date(b.start_time).getTime();
    return dateA - dateB;
  });

  const classes = lessons.map((lesson) => {
    const startDate = new Date(lesson.start_time);
    const endDate = new Date(lesson.end_time);

    // Determinar el estado si no está proporcionado
    const status = lesson.status ||
      (parseInt(lesson.spots.split('/')[0]) < 0 ? 'full' : 'available');

    return {
      id: lesson.id,
      title: lesson.title,
      date: formatDate(lesson.start_time),
      time: `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`,
      teacher: lesson.teacher_name,
      status: status,
      spots: lesson.spots,
    };
  });


  return (
    <div className="space-y-4">
      {classes.map((cls) => (
        <ClassListViewCard
          key={cls.id}
          cls={cls}
          getDashboard={getDashboard}
          currentUser={currentUser} // pass currentUser to card
        />
      ))}
    </div>
  )
}


