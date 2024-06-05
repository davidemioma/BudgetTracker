import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>

          <CardDescription>The total amount you've spent.</CardDescription>
        </CardHeader>

        <CardContent>0</CardContent>
      </Card>
    </div>
  );
}

export default App;
