import React, { useState } from "react";
import './App.css'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const Calculator = () => {
  const [expression, setExpression] = useState("");

  const handleButtonClick = (value) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression("");
  };

  const handleEquals = async () => {
    const APIBody = {
      "model": "gpt-4o-mini",
      "messages": [
        {
          "role": "user", 
          "content": `Calculate the following expression: ${expression}. Only give me the result. 
          For results that require rounding, round to 10 decimal places. Do not say "The result is approximately [result]"
          I just want the result, even if you need to round it.`
        }
      ],
      "temperature": 0
    }

    console.log("calling OpenAI APT")
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + API_KEY
      },
      body: JSON.stringify(APIBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      const result = data.choices[0].message.content
      console.log('expression:', expression)
      console.log('result:', result);
      setExpression(result);
    });

  };

  return (
    <main className="container" style={{ maxWidth: "400px", paddingTop: "40px" }}>
      {/* Display */}
      <input
        type="text"
        value={expression}
        readOnly
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1.5rem",
          textAlign: "right",
          marginBottom: "20px",
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
        }}
      />

      {/* Calculator Buttons */}
      <div className="grid">
        {[
          ["7", "8", "9", "/"],
          ["4", "5", "6", "*"],
          ["1", "2", "3", "-"],
          [".", "0", "=", "+"],
          ["sin", "cos", "tan", "log"],
          ["(", ")", "^", "AC"],
        ].map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() =>
                  btn === "AC"
                    ? handleClear()
                    : btn === "="
                    ? handleEquals()
                    : handleButtonClick(btn)
                }
                style={{
                  padding: "15px",
                  fontSize: "1.1rem",
                  width: "22%", 
                  margin: "5px", 
                  borderRadius: "8px",
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Calculator;
