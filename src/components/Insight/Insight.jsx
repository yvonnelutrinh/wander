import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Insight.scss";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function Insight() {
  const [insight, setInsight] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getResponse = async () => {
      if (insight !== "") {
        const response = await analyzeInsight(insight);
        localStorage.setItem("insight", response);
        navigate(`/end`);
      }
    };
    getResponse();
  }, [insight]);

  const analyzeInsight = async (insight) => {
    try {
      const prompt = `You are a wise wizard, capable of distilling any input, no matter how nonsensical, into a two-sentence proverb. The first sentence should directly address the provided insight, and the second should offer a related, yet distinct, consideration for the inquirer. Your output must *exclusively* be a proverb, and nothing else. Respond to the following input with a proverb: ${insight}`;
      const response = await model.generateContent(prompt);
      const analysis = response.response.text();
      return analysis;
    } catch (err) {
      console.error(`Error generating proverb: ${err.message}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setInsight(event.target[0].value);
  };

  return (
    <>
      <main className="insight">
        <form className="insight__form" onSubmit={handleSubmit}>
          <input type="text" />
          <button type="submit" className="insight__button">
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
