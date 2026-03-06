export interface EventScenario {
  id: string;
  label: string;
  account: string;
  department: string;
  executive: string;
  deliverableType: string;
  eventName: string;
  date: string;
  location: string;
  eventFormat: string;
  interviewer: string;
  duration: string;
  otherPanelists?: string;
  targetAudience: string;
  objective: string;
  keyMessages: string;
  anticipatedTopics: string;
  sensitivities: string;
}

export const eventScenarios: EventScenario[] = [
  {
    id: "ceraweek-2026",
    label: "CERAWeek by S&P Global 2026",
    account: "ENEC",
    department: "Corporate Communications",
    executive: "Mohamed Al Hammadi — Managing Director & CEO",
    deliverableType: "Talking Points — Panel / Interview",
    eventName: "CERAWeek by S&P Global 2026",
    date: "March 18, 2026",
    location: "Houston, Texas, USA",
    eventFormat: "Solo Interview",
    interviewer: "Bloomberg Energy Correspondent",
    duration: "20 minutes",
    targetAudience: "US energy investors, policy makers, tech sector leaders",
    objective:
      "Position Al Hammadi as the leading international nuclear voice on AI energy demand and establish ENEC as the credible partner for US nuclear expansion",
    keyMessages:
      "ENEC's Barakah model is proven and exportable. The US AI energy demand gap is an opportunity ENEC is uniquely positioned to fill. ENEC is ready to build, invest, and operate beyond the UAE.",
    anticipatedTopics:
      "AI and data centre energy demand, ENEC's US expansion plans, SMR technology, Barakah as global benchmark, UAE-US energy partnership",
    sensitivities:
      "Nuclear waste comparisons, cost overrun references, Sizewell C status",
  },
  {
    id: "middle-east-energy-2026",
    label: "Middle East Energy 2026",
    account: "ENEC",
    department: "Corporate Communications",
    executive: "Mohamed Al Hammadi — Managing Director & CEO",
    deliverableType: "Talking Points — Panel / Interview",
    eventName: "Middle East Energy 2026",
    date: "April 8, 2026",
    location: "Dubai World Trade Centre, UAE",
    eventFormat: "Panel",
    interviewer: "Energy Leadership Summit Moderator",
    duration: "45 minutes",
    otherPanelists:
      "H.E. Sharif Al Olama (UAE Ministry of Energy & Infrastructure), Yousif Al Ali (CEO, Etihad WE)",
    targetAudience:
      "Regional energy ministers, utility executives, project developers, MENA investors",
    objective:
      "Reinforce ENEC's regional leadership in nuclear energy and position Al Hammadi as the definitive voice on nuclear's role in the UAE and MENA energy mix",
    keyMessages:
      "Barakah is delivering 25% of UAE electricity today — nuclear is not a future promise, it is present reality. Nuclear is the anchor of the UAE's energy security and net zero strategy. ENEC's model is ready to support MENA nations seeking reliable clean baseload power.",
    anticipatedTopics:
      "UAE energy mix and security, nuclear's role in net zero by 2050, clean energy transition for the region, future energy demand from AI and industrialisation",
    sensitivities:
      "Direct comparisons with solar/renewables, political references to neighbouring countries, Sizewell C status",
  },
  {
    id: "emul-2026",
    label: "EMEA Modular & UK Large Reactors 2026",
    account: "ENEC",
    department: "Corporate Communications",
    executive: "Mohamed Al Hammadi — Managing Director & CEO",
    deliverableType: "Talking Points — Panel / Interview",
    eventName: "EMEA Modular & UK Large Reactors 2026 (EMUL2026)",
    date: "March 25, 2026",
    location: "London, UK",
    eventFormat: "Panel",
    interviewer: "FutureNuclear Conference Moderator",
    duration: "30 minutes",
    otherPanelists:
      "European Parliament member, Kenya Nuclear Regulatory Authority Director General, Microsoft Energy Industry Advisor EMEA",
    targetAudience:
      "European nuclear policymakers, SMR developers, institutional investors, UK government stakeholders, global nuclear supply chain",
    objective:
      "Position ENEC as the global model for nuclear project delivery and establish Al Hammadi as the leading voice on how EMEA nations can accelerate SMR and large reactor deployment using the Barakah blueprint",
    keyMessages:
      "ENEC built the Arab world's first nuclear plant in under 12 years — that model is transferable. SMR deployment in EMEA needs what ENEC has: institutional knowledge, regulatory experience, and a proven delivery track record. ENEC is ready to partner with EMEA nations on both large-scale and modular reactor programmes.",
    anticipatedTopics:
      "SMR deployment timelines and barriers in EMEA, UK large reactor programme (Sizewell C), lessons from Barakah for new nuclear nations in Africa and Europe, AI-nuclear energy convergence, financing models for new nuclear",
    sensitivities:
      "Sizewell C investment decision specifics, nuclear waste management comparisons, cost overrun references",
  },
];
