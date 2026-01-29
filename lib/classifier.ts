import natural from "natural";

const classifier = new natural.BayesClassifier();

classifier.addDocument(
  "software engineering developer coding javascript typescript python rust go backend frontend react nextjs svelte docker kubernetes microservices architecture system design git github devops ci/cd api rest graphql cloud aws azure serverless linux bash vim emacs",
  "Tech",
);
classifier.addDocument(
  "ai llm large language model machine learning ml deep learning neural networks transformers gpt claude gemini stable diffusion inference fine-tuning pytorch tensorflow openai agents computer vision nlp prompt engineering rAG weights biases parameters automation",
  "AI",
);

classifier.addDocument(
  "data science analytics sql pandas numpy visualization tableau powerbi big data spark hadoop warehouse snowflake etl dashboard statistics probability modeling",
  "Data",
);
classifier.addDocument(
  "cybersecurity pentesting hacking security malware ransomware encryption firewall soc phish zero-day vulnerability cve exploit kali linux auth oauth jwt network security privacy",
  "Security",
);
classifier.addDocument(
  "bitcoin crypto web3 ethereum blockchain nft solana dao decentralization defi smart contracts solidity wallet ledger staking mining airdrop exchange binance uniswap layer2 scaling p2p hdl",
  "Crypto",
);
classifier.addDocument(
  "startup founder entrepreneur venture capital vc seed funding series a bootstrap pitch deck growth hacking saas b2b b2c business model revenue equity exit acquisition scaling product market fit incubator accelerator opex capex",
  "Business",
);
classifier.addDocument(
  "marketing seo sem advertising branding copywriting social media campaigns conversion funnel leads crm salesforce outbound inbound email marketing growth attribution analytics",
  "Marketing",
);
classifier.addDocument(
  "stocks investing finance money market trading wall street options futures dividends portfolio management macroeconomics inflation interest rates fed yields banking fintech wealth management bull bear market stocks indices etf",
  "Finance",
);
classifier.addDocument(
  "product management roadmap agile scrum sprint user stories backlog jira figma ui ux design wireframe prototype typography branding user research persona",
  "Product",
);
classifier.addDocument(
  "hr hiring recruitment talent acquisition culture workplace leadership management soft skills coaching mentoring interview resume career growth headhunter diversity equity inclusion dei",
  "People",
);
classifier.addDocument(
  "politics election government policy news vote democracy legislation senate parliament diplomacy geopolitical international relations human rights activism regulation law supreme court public policy war conflict energy policy",
  "Politics",
);
classifier.addDocument(
  "fitness gym health nutrition wellness biohacking longevity workout meditation mental health productivity routine sleep habits supplement yoga marathon training burnout therapy mindfulness",
  "Lifestyle",
);
classifier.addDocument(
  "photography cinematography video editing premiere pro after effects gaming streaming music production podcasting creator economy storytelling youtube newsletter writing journalism art",
  "Creative",
);
classifier.addDocument(
  "funny lol meme joke sarcasm humor comedy parody satirical viral thread shitposting standup entertainment cinema movies pop culture",
  "Humor",
);
classifier.addDocument(
  "education learning university research academia science physics biology chemistry astronomy telescope space exploration climate change teaching student academic phd",
  "Science",
);

classifier.train();

export { classifier };
