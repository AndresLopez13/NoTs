import { Exam } from "@/types/Reminder";
import { Text, View, TextInput, Button } from "./Themed";

export default function ListExams({ exams }: Exam) {
  console.log(exams);

  return (
    <View>
      <Text>Exams</Text>
      {exams?.map((exam) => (
        <View key={exam.id}>
          <Text>{exam.name}</Text>
          <Text>{exam.description}</Text>
          <Text>{exam.date}</Text>
          <Text>{exam.time}</Text>
        </View>
      ))}
    </View>
  );
}
