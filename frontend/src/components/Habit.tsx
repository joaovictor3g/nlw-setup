interface HabitProps {
  completed: number;
}

export function Habit({ completed }: HabitProps) {
  return (
    <p className="bg-zinc-900 w-10 h-10 text-white flex justify-center items-center">
      {completed}
    </p>
  );
}
