function removeCommonLeadingWords(str1: string, str2: string) {
  const tokenize = (str: string) => str.split(/[\s-]+/);
  const words1 = tokenize(str1);
  const words2 = tokenize(str2);

  let i = 0;
  while (i < words1.length && i < words2.length && words1[i] === words2[i]) {
    i++;
  }

  return words1.slice(i).join(" ");
}

export function setupSpeechRecognition() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.continuous = true;
  recognition.interimResults = true;

  let lastTranscript = "";
  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (!event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }

    const cleanedTranscript = removeCommonLeadingWords(
      transcript,
      lastTranscript
    );
    lastTranscript = transcript;

    const commands = cleanedTranscript
      .trim()
      .toUpperCase()
      .split(" ")
      .filter((x) => x);
    if (commands.length > 0) {
      console.log("Commands", commands);
    }
  };

  recognition.onerror = (event) => {
    if (event.error === "no-speech") {
      console.warn("No speech detected, continuing recognition.");
      return;
    }
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended, restarting...");
    setTimeout(() => {
      recognition.start();
    }, 1000);
  };

  recognition.start();
}
