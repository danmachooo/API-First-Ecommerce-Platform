import app from "./app";

const PORT: number = Number(process.env.PORT) || 3000;
const baseUrl: string = process.env.BASE_URL || "http://localhost:";

app.listen(PORT, () => {
  console.log(`Server running on ${baseUrl}${PORT}`);
});
