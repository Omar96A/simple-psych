// Add a new object here each week to publish a new blog post automatically.
// The static build will generate both the /blog/ index and the individual post page.
export const blogPosts = [
  {
    slug: "measurement-based-care-in-psychiatry",
    title: "Measurement-Based Care in Psychiatry",
    date: "2026-04-08",
    excerpt:
      "Why structured rating scales still matter in psychiatry, and how measurement-based care can make treatment more focused, collaborative, and easier to adjust over time.",
    paragraphs: [
      "Measurement-based care is one of the clearest ways to make psychiatric follow-up more concrete. Instead of relying only on general impressions like \"a little better\" or \"still anxious,\" clinicians use validated symptom measures over time to see whether treatment is actually moving in the right direction.[1][2]",
      "Yale describes measurement-based care as a clinical process in which clinicians and patients use patient-reported outcome data to track progress and guide treatment decisions. That framing matters because it keeps the scales connected to care, not separate from it. The point is not paperwork. The point is to notice sooner when someone is improving, stalling, or sliding backward.[1]",
      "The APA's resource document makes a similar case from a practice and systems perspective. It highlights that routine measurement can improve engagement, strengthen symptom validation, support shared decision-making, and make visits more efficient by shifting less time toward basic data gathering and more time toward psychoeducation, motivation, and treatment planning.[2]",
      "Psychiatric Times has long argued that psychiatry benefits when it borrows the same treat-to-target mindset used in other areas of medicine. In depression care, for example, structured symptom monitoring can make it easier to identify partial response, decide when a dose adjustment is reasonable, and avoid overestimating improvement based only on a brief conversation.[3]",
      "In everyday practice, measurement-based care works best when the tools are simple and repeatable. A clinic might use the PHQ-9 for depressive symptoms, the GAD-7 for anxiety, a mania scale when bipolar symptoms are active, or disorder-specific scales when the diagnosis calls for them. The real value comes from using the same tool consistently enough that both clinician and patient can see the trajectory.[1][2]",
      "Measurement-based care also tends to help the therapeutic relationship when it is used well. Patients often feel more understood when their symptoms are tracked in a structured way, and the data can help anchor conversations that might otherwise feel vague or emotionally loaded. That does not replace clinical judgment. It gives clinical judgment a clearer signal to work with.[1][2]",
      "The practical question for most psychiatrists is not whether measurement-based care is conceptually useful. It is how to make it sustainable. The strongest implementations are usually the least dramatic: choose a small core set of scales, collect them before visits when possible, review them with the patient in real time, and let the results shape the next treatment decision.[1][2][3]",
    ],
    references: [
      {
        label: "Yale School of Medicine, Yale Measurement Based Care Collaborative, updated September 8, 2025",
        href: "https://medicine.yale.edu/psychiatry/research/clinics-and-programs/mbccollab/",
      },
      {
        label: "American Psychiatric Association, Resource Document on Implementation of Measurement-Based Care, approved June 2023",
        href: "https://www.psychiatry.org/getattachment/3d9484a0-4b8e-4234-bd0d-c35843541fce/Resource-Document-on-Implementation-of-Measurement-Based-Care.pdf",
      },
      {
        label: "Psychiatric Times, Measurement-Based Care for the Treatment of Depression, published August 30, 2009",
        href: "https://www.psychiatrictimes.com/view/measurement-based-care-treatment-depression",
      },
    ],
  },
  {
    slug: "adult-adhd-symptoms-that-often-get-missed",
    title: "Adult ADHD Symptoms That Often Get Missed",
    date: "2026-04-07",
    excerpt:
      "A quick clinical look at how adult ADHD can present more as restlessness, disorganization, and emotional impulsivity than obvious hyperactivity.",
    relatedDiagnosisId: "adhd",
    paragraphs: [
      "Adult ADHD often looks less like classic childhood hyperactivity and more like chronic disorganization, restlessness, inconsistent follow-through, and difficulty sustaining effort on tasks that are not immediately rewarding.",
      "Many adults describe years of feeling capable but unreliable. They can perform extremely well in bursts, especially when interested, but struggle with routine demands, deadlines, paperwork, and staying organized across multiple responsibilities.",
      "Another reason adult ADHD gets missed is overlap with anxiety, depression, trauma, sleep disruption, and substance use. A careful history helps clarify whether attention problems are longstanding and trait-like or whether they appeared later as part of another syndrome.",
      "When ADHD is on the table, it helps to ask about childhood symptoms, school patterns, workplace problems, relationship strain, impulsive decision-making, and how much effort it takes the person to stay afloat compared with peers.",
    ],
    references: [],
  },
  {
    slug: "insomnia-vs-not-getting-enough-sleep",
    title: "Insomnia vs. Not Getting Enough Sleep",
    date: "2026-04-07",
    excerpt:
      "Why trouble sleeping is not always insomnia disorder, and why sleep opportunity matters clinically.",
    relatedDiagnosisId: "insomnia-disorder",
    paragraphs: [
      "Not everyone who sleeps too little has insomnia disorder. One of the most useful distinctions in clinic is whether the person actually has enough opportunity for sleep in the first place.",
      "A patient who is working late, waking early, taking care of children overnight, or staying up for lifestyle reasons may be sleep deprived, but that is different from wanting to sleep and being unable to do it despite good opportunity.",
      "Insomnia disorder becomes more likely when the patient has enough time to sleep, wants to sleep, and still repeatedly struggles with falling asleep, staying asleep, or getting back to sleep, along with daytime consequences.",
      "That distinction matters because the treatment pathway changes. Schedule change and sleep opportunity come first for deprivation, while chronic insomnia often calls for CBT-I and more targeted behavioral or medication decisions.",
    ],
    references: [],
  },
  {
    slug: "panic-attack-vs-panic-disorder",
    title: "Panic Attack vs. Panic Disorder",
    date: "2026-04-07",
    excerpt:
      "A panic attack is a symptom event. Panic disorder is the larger syndrome that grows around recurrent unexpected attacks.",
    relatedDiagnosisId: "panic-disorder",
    paragraphs: [
      "A panic attack is a sudden surge of intense fear or discomfort that peaks within minutes and brings symptoms like palpitations, chest discomfort, trembling, shortness of breath, dizziness, or fear of losing control.",
      "Panic disorder is different. It requires recurrent unexpected panic attacks plus the aftermath: persistent worry about more attacks, concern about what the attacks mean, or meaningful behavior change such as avoidance.",
      "That is why someone can have panic attacks without meeting criteria for panic disorder. Panic attacks can occur in PTSD, social anxiety disorder, specific phobia, substance-related states, and medical conditions as well.",
      "In practice, one of the best diagnostic questions is what happened after the attack. If the patient's life started to narrow around fear of the next one, panic disorder becomes much more likely.",
    ],
    references: [],
  },
];
