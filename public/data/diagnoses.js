export const diagnoses = [
  {
    id: "major-depressive-disorder",
    name: "Major Depressive Disorder",
    category: "Depressive Disorders",
    aliases: ["MDD", "Major depression"],
    searchTerms: ["depression", "unipolar depression"],
    summary:
      "Major depressive disorder is usually the picture people imagine when they think of a true depressive episode: a sustained drop in mood or interest, plus changes in sleep, energy, appetite, thinking, and day-to-day functioning that feel like a clear shift from the person's baseline.",
    highlights: [
      {
        label: "Clinical frame",
        text: "Think in episodes. The key question is whether this looks like at least 2 weeks of symptoms that clearly differ from the person's usual self.",
      },
      {
        label: "Rule-outs",
        text: "Before settling on MDD, slow down and check for bipolarity, substance effects, psychosis, grief context, and medical contributors.",
      },
      {
        label: "Specifier thinking",
        text: "Once the episode is established, the next useful step is asking how it presents: anxious distress, melancholic features, psychosis, seasonality, catatonia, or peripartum onset can all change management.",
      },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Five or more symptoms are present during the same 2-week period and represent a change from previous functioning.",
          "At least one of the symptoms is either depressed mood or markedly diminished interest or pleasure.",
          "The symptom set may include depressed mood most of the day, nearly every day.",
          "The symptom set may include markedly diminished interest or pleasure in nearly all activities.",
          "The symptom set may include significant weight loss, weight gain, or appetite change when not dieting.",
          "The symptom set may include insomnia or hypersomnia nearly every day.",
          "The symptom set may include psychomotor agitation or retardation observable by others.",
          "The symptom set may include fatigue or loss of energy nearly every day.",
          "The symptom set may include feelings of worthlessness or excessive or inappropriate guilt.",
          "The symptom set may include diminished ability to think, concentrate, or make decisions.",
          "The symptom set may include recurrent thoughts of death, suicidal ideation, a suicide plan, or a suicide attempt.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The episode is not attributable to a substance or another medical condition.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The presentation is not better explained by a schizophrenia-spectrum or other psychotic disorder.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "There has never been a manic or hypomanic episode unless clearly substance- or medically induced.",
        ],
      },
    ],
    scales: [
      { name: "PHQ-9", use: "Fast symptom burden tracking in outpatient settings." },
      { name: "HAM-D", use: "Clinician-rated depression severity, often used in specialty care and research." },
      { name: "QIDS-SR16", use: "Useful when you want a brief depressive symptom measure with repeated follow-up." },
      { name: "MADRS", use: "Sensitive to change during treatment response assessment." },
    ],
    medications: [
      {
        section: "Acute treatment of major depressive disorder",
        note:
          "Common FDA-indicated antidepressants for MDD; agent choice still depends on age, comorbidity, and adverse-effect profile.",
        drugs: [
          "Fluoxetine",
          "Sertraline",
          "Paroxetine",
          "Citalopram",
          "Escitalopram",
          "Bupropion",
          "Venlafaxine XR",
          "Desvenlafaxine",
          "Duloxetine",
          "Levomilnacipran ER",
          "Vilazodone",
          "Vortioxetine",
          "Mirtazapine",
          "Trazodone",
        ],
      },
      {
        section: "Adjunctive treatment for major depressive disorder",
        note:
          "These are FDA-indicated as add-on treatments rather than stand-alone first-line monotherapy for routine MDD care.",
        drugs: ["Aripiprazole", "Brexpiprazole", "Quetiapine XR"],
      },
    ],
    offLabelTreatments: ["Lithium", "Lamotrigine", "Modafinil"],
    interventionalOptions: [
      "ECT is established for severe or psychotic depression and is often considered when rapid response is needed.",
      "Repetitive TMS is used in treatment-resistant depression.",
      "Ketamine or esketamine-based strategies are used in treatment-resistant depression settings.",
    ],
  },
  {
    id: "bipolar-i-disorder",
    name: "Bipolar I Disorder",
    category: "Bipolar and Related Disorders",
    aliases: ["Bipolar I", "Bipolar 1 disorder"],
    searchTerms: ["mania", "bipolar disorder", "mixed features"],
    summary:
      "Bipolar I disorder is defined by mania. Many patients spend more time depressed than manic, but a single true manic episode changes the diagnostic frame and has major implications for risk, treatment, and long-term planning.",
    highlights: [
      {
        label: "Defining feature",
        text: "A full manic episode is enough for the diagnosis, even if the person has never had a major depressive episode.",
      },
      {
        label: "High-risk points",
        text: "The highest-stakes questions are usually about psychosis, impulsivity, suicidality, spending, sexual risk, agitation, and how fast functioning is falling apart.",
      },
      {
        label: "Treatment lens",
        text: "Treatment decisions usually make the most sense when you anchor them to polarity: acute mania, bipolar depression, or maintenance after stabilization.",
      },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "A manic episode is a distinct period of abnormally and persistently elevated, expansive, or irritable mood together with abnormally and persistently increased activity or energy.",
          "The episode lasts at least 1 week and is present most of the day, nearly every day, unless hospitalization is required sooner.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "During the period of mood disturbance and increased energy or activity, 3 or more of the following symptoms are present to a significant degree, or 4 if the mood is only irritable:",
          "Inflated self-esteem or grandiosity.",
          "Decreased need for sleep.",
          "More talkative than usual or pressure to keep talking.",
          "Flight of ideas or racing thoughts.",
          "Distractibility.",
          "Increase in goal-directed activity or psychomotor agitation.",
          "Excessive involvement in risky or high-consequence activities.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The episode is severe enough to cause marked impairment in social or occupational functioning, require hospitalization to prevent harm, or include psychotic features.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The episode is not attributable to substances or another medical condition.",
          "If mania emerges during antidepressant treatment but persists beyond the physiologic effect of treatment, it counts as a manic episode.",
        ],
      },
    ],
    scales: [
      { name: "YMRS", use: "Standard clinician-rated tool for manic symptom severity." },
      { name: "CGI-BP", use: "Quick global severity and improvement tracking across polarity states." },
      { name: "MADRS", use: "Often paired with bipolar depression monitoring." },
      { name: "Altman Self-Rating Mania Scale", use: "Brief self-report check for manic symptoms between visits." },
    ],
    medications: [
      {
        section: "Acute mania or mixed episodes",
        note:
          "FDA-indicated options commonly used for manic or mixed states; some are also used in maintenance after stabilization.",
        drugs: [
          "Lithium",
          "Divalproex",
          "Carbamazepine",
          "Olanzapine",
          "Quetiapine",
          "Risperidone",
          "Aripiprazole",
          "Ziprasidone",
          "Asenapine",
          "Cariprazine",
        ],
      },
      {
        section: "Bipolar depression",
        note:
          "FDA-indicated medications specifically tied to bipolar depressive episodes in bipolar I disorder or bipolar depression labeling.",
        drugs: ["Quetiapine", "Lurasidone", "Cariprazine", "Lumateperone", "Olanzapine/Fluoxetine"],
      },
      {
        section: "Maintenance treatment",
        note:
          "Maintenance choices are used to reduce recurrence risk after acute stabilization and should be individualized by polarity pattern.",
        drugs: ["Lithium", "Lamotrigine", "Aripiprazole", "Olanzapine", "Quetiapine", "Ziprasidone"],
      },
    ],
    offLabelTreatments: ["Lamotrigine", "Oxcarbazepine", "Clozapine"],
    interventionalOptions: [
      "ECT is used in severe mania, psychotic mood episodes, and refractory bipolar depression.",
      "Ketamine is being studied and used selectively for bipolar depression in specialty settings.",
      "TMS is under study and used off-label in some bipolar depression programs.",
    ],
  },
  {
    id: "schizophrenia",
    name: "Schizophrenia",
    category: "Schizophrenia Spectrum and Other Psychotic Disorders",
    aliases: ["Schizophrenia disorder"],
    searchTerms: ["psychosis", "hallucinations", "delusions"],
    summary:
      "Schizophrenia is a chronic psychotic illness in which delusions, hallucinations, disorganization, and negative symptoms begin to reshape how a person functions over time. The diagnosis becomes clearer when the psychotic symptoms persist, functioning drops, and shorter or mood-driven explanations stop fitting well.",
    highlights: [
      {
        label: "Timeline",
        text: "The timing matters. You need at least 1 month of active symptoms within a broader disturbance that lasts 6 months or longer.",
      },
      {
        label: "Mandatory symptom mix",
        text: "Not every symptom combination qualifies. You need at least two core psychotic symptoms, and one of them must be delusions, hallucinations, or disorganized speech.",
      },
      {
        label: "Functional anchor",
        text: "A real drop in work, relationships, school performance, or self-care helps separate schizophrenia from briefer or less entrenched psychotic syndromes.",
      },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Two or more characteristic symptoms are present for a significant part of 1 month, or less if successfully treated.",
          "At least one symptom is delusions, hallucinations, or disorganized speech.",
          "The characteristic symptoms are delusions, hallucinations, disorganized speech, grossly disorganized or catatonic behavior, and negative symptoms such as diminished emotional expression or avolition.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "For a significant portion of the time since onset, level of functioning in work, interpersonal relations, or self-care is markedly below the prior level.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "Continuous signs of disturbance persist for at least 6 months.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "Schizoaffective disorder and mood disorders with psychotic features have been ruled out appropriately.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The disturbance is not attributable to a substance or another medical condition.",
        ],
      },
      {
        title: "Criterion F",
        items: [
          "Functioning in work, interpersonal relations, or self-care is markedly below prior level.",
          "If there is a history of autism spectrum disorder or communication disorder of childhood onset, prominent delusions or hallucinations must also be present for at least 1 month.",
        ],
      },
    ],
    scales: [
      { name: "PANSS", use: "Broad clinician-rated severity measure across positive, negative, and general psychopathology." },
      { name: "BPRS", use: "Shorter psychosis severity instrument for inpatient or consultation settings." },
      { name: "CGI-S", use: "Fast global severity check when full psychosis scales are not practical." },
      { name: "AIMS", use: "Essential when monitoring tardive dyskinesia during antipsychotic treatment." },
    ],
    medications: [
      {
        section: "Treatment of schizophrenia",
        note:
          "FDA-approved antipsychotics for schizophrenia vary by age bracket and formulation; verify product-specific labeling.",
        drugs: [
          "Haloperidol",
          "Perphenazine",
          "Loxapine",
          "Chlorpromazine",
          "Fluphenazine",
          "Risperidone",
          "Olanzapine",
          "Quetiapine",
          "Ziprasidone",
          "Aripiprazole",
          "Paliperidone",
          "Asenapine",
          "Lurasidone",
          "Brexpiprazole",
          "Cariprazine",
          "Lumateperone",
          "Iloperidone",
        ],
      },
      {
        section: "Treatment-resistant schizophrenia and suicidality",
        note:
          "Clozapine carries distinct FDA labeling for treatment-resistant schizophrenia and for reducing recurrent suicidal behavior in schizophrenia or schizoaffective disorder.",
        drugs: ["Clozapine"],
      },
      {
        section: "Long-acting injectable options",
        note:
          "These are useful when adherence is a major driver of relapse risk; check each product for oral overlap and maintenance requirements.",
        drugs: [
          "Haloperidol decanoate",
          "Fluphenazine decanoate",
          "Risperidone microspheres",
          "Paliperidone palmitate",
          "Aripiprazole monohydrate",
          "Aripiprazole lauroxil",
          "Olanzapine pamoate",
        ],
      },
    ],
    offLabelTreatments: ["Clozapine augmentation strategies", "Mood stabilizer augmentation", "Antidepressant augmentation for negative symptoms"],
    interventionalOptions: [
      "ECT is used in catatonia, severe psychosis, or clozapine-resistant cases.",
      "TMS is under investigation for hallucinations and negative symptoms.",
      "Ketamine is not a standard schizophrenia treatment and is mainly research-limited here.",
    ],
  },
  {
    id: "adhd",
    name: "Attention-Deficit/Hyperactivity Disorder",
    category: "Neurodevelopmental Disorders",
    aliases: ["ADHD"],
    searchTerms: ["attention deficit", "inattention", "hyperactivity", "impulsivity"],
    summary:
      "ADHD is not just distractibility. It is a longstanding pattern of inattention, hyperactivity, impulsivity, or some combination of the three that starts early, shows up across settings, and genuinely gets in the way of functioning.",
    highlights: [
      {
        label: "Two-domain structure",
        text: "It helps to think in two buckets: inattentive symptoms and hyperactive-impulsive symptoms. Some patients live mostly in one domain, while others clearly show both.",
      },
      {
        label: "Cross-setting rule",
        text: "The pattern should not live in just one environment. Symptoms need to show up in at least two settings, such as home, school, work, or social life.",
      },
      {
        label: "Adult nuance",
        text: "Adults often look less overtly hyperactive than children. What shows up instead may be restlessness, disorganization, forgetfulness, and chronic executive-function problems.",
      },
    ],
    criteria: [
      {
        title: "Criterion A1",
        items: [
          "Six or more symptoms of inattention persist for at least 6 months, or 5 or more if age 17 or older.",
          "The symptoms are inconsistent with developmental level and negatively affect functioning.",
          "Inattention symptoms include careless mistakes, difficulty sustaining attention, seeming not to listen, not following through on instructions, difficulty organizing tasks, avoiding sustained mental effort, losing necessary items, distractibility, and forgetfulness.",
        ],
      },
      {
        title: "Criterion A2",
        items: [
          "Six or more symptoms of hyperactivity-impulsivity persist for at least 6 months, or 5 or more if age 17 or older.",
          "Hyperactivity-impulsivity symptoms include fidgeting, leaving seat when expected to remain seated, running or climbing in inappropriate situations or inner restlessness, difficulty engaging quietly, acting as if driven by a motor, excessive talking, blurting out answers, trouble waiting, and interrupting or intruding on others.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "Several symptoms were present before age 12.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "Several symptoms are present in two or more settings.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "There is clear evidence that the symptoms interfere with or reduce the quality of social, academic, or occupational functioning.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "Symptoms interfere with social, academic, or occupational functioning and are not better explained by another mental disorder.",
        ],
      },
    ],
    scales: [
      { name: "Adult ADHD Self-Report Scale (ASRS v1.1)", use: "Common adult screening and follow-up tool." },
      { name: "Vanderbilt ADHD Diagnostic Rating Scales", use: "Useful when gathering parent and teacher collateral in pediatric practice." },
      { name: "Conners Rating Scales", use: "Broad symptom and impairment profiling across settings." },
      { name: "WFIRS", use: "Measures functional impairment rather than symptoms alone." },
    ],
    medications: [
      {
        section: "Stimulants for ADHD",
        note:
          "These medications are FDA-indicated for ADHD in specific age ranges and formulations; product-level labeling differs.",
        drugs: [
          "Methylphenidate",
          "Dexmethylphenidate",
          "Mixed amphetamine salts",
          "Dextroamphetamine",
          "Lisdexamfetamine",
        ],
      },
      {
        section: "Nonstimulants for core ADHD symptoms",
        note:
          "These options are useful when stimulant tolerability, misuse risk, anxiety, tics, sleep issues, or patient preference changes treatment selection.",
        drugs: ["Atomoxetine", "Viloxazine ER", "Guanfacine ER", "Clonidine ER"],
      },
    ],
    offLabelTreatments: ["Bupropion", "Modafinil", "Nortriptyline"],
    interventionalOptions: [
      "TMS is being studied for ADHD but is not standard care.",
      "Neurofeedback and other device-based approaches are under study.",
      "ECT and ketamine are not standard ADHD interventions.",
    ],
  },
  {
    id: "obsessive-compulsive-disorder",
    name: "Obsessive-Compulsive Disorder",
    category: "Obsessive-Compulsive and Related Disorders",
    aliases: ["OCD"],
    searchTerms: ["obsessions", "compulsions"],
    summary:
      "OCD usually feels to patients like getting trapped in a loop. Unwanted thoughts, urges, or images show up again and again, and the person starts doing rituals or mental acts to lower the distress, even when part of them knows the cycle does not really make sense.",
    highlights: [
      {
        label: "Core distinction",
        text: "The most useful distinction is simple: obsessions are the intrusive experiences, and compulsions are what the person does to feel safer, more certain, or less distressed.",
      },
      {
        label: "Time and impairment",
        text: "In practice, OCD starts to stand out when it is eating up time, driving avoidance, or making ordinary routines feel much harder than they should.",
      },
      {
        label: "Treatment pairing",
        text: "The usual treatment conversation pairs ERP with medication. Most medication pathways start with an SSRI, with clomipramine as another classic option.",
      },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Obsessions, compulsions, or both are present.",
          "Obsessions are recurrent and persistent thoughts, urges, or images that are experienced as intrusive and unwanted and usually cause anxiety or distress.",
          "The person attempts to ignore, suppress, or neutralize obsessions with another thought or action.",
          "Compulsions are repetitive behaviors or mental acts performed in response to an obsession or according to rigid rules.",
          "The compulsions are aimed at preventing or reducing anxiety or some dreaded event or situation, but are either not realistically connected to what they are designed to prevent or are clearly excessive.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "Obsessions or compulsions are time-consuming or cause clinically significant distress or impairment.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The symptoms are not due to substances or another medical condition.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The disturbance is not better explained by another mental disorder such as GAD, body dysmorphic disorder, illness anxiety disorder, or psychosis.",
        ],
      },
    ],
    scales: [
      { name: "Y-BOCS", use: "Most common clinician-rated severity scale for OCD." },
      { name: "OCI-R", use: "Brief self-report symptom tracking across obsession and compulsion domains." },
      { name: "CGI-S", use: "Quick global severity measure for routine follow-up." },
      { name: "DOCS", use: "Dimension-based self-report measure across contamination, responsibility, taboo thoughts, and symmetry." },
    ],
    medications: [
      {
        section: "FDA-indicated monotherapy options for OCD",
        note:
          "These are the most established FDA-labeled medications for OCD, with age-specific approvals differing by product.",
        drugs: ["Fluoxetine", "Fluvoxamine", "Sertraline", "Paroxetine", "Clomipramine"],
      },
    ],
    offLabelTreatments: ["Aripiprazole augmentation", "Risperidone augmentation", "Memantine augmentation"],
    interventionalOptions: [
      "Deep TMS and other neuromodulation strategies are being studied in OCD.",
      "ECT is not a standard OCD treatment but may be used in severe comorbid states.",
      "Ketamine is under investigation for rapid symptom reduction in OCD.",
    ],
  },
  {
    id: "generalized-anxiety-disorder",
    name: "Generalized Anxiety Disorder",
    category: "Anxiety Disorders",
    aliases: ["GAD"],
    searchTerms: ["worry", "chronic anxiety"],
    summary:
      "Generalized anxiety disorder often sounds like a mind that cannot let go. The worry moves from one topic to another, keeps going even when the person knows it is excessive, and starts to show up in the body through tension, poor sleep, irritability, and mental fatigue.",
    highlights: [
      { label: "Time threshold", text: "This is not brief situational stress. The worry tends to stick around across months and becomes part of the person's daily life." },
      { label: "Breadth", text: "The worry is usually broad rather than narrowly focused, moving across health, finances, work, family, and ordinary responsibilities." },
      { label: "Clinical overlap", text: "It is worth checking whether this is really GAD or whether panic, OCD, PTSD, illness anxiety, substances, or a medical problem fits better." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Excessive anxiety and worry occur more days than not for at least 6 months about a number of events or activities.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The individual finds it difficult to control the worry.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The anxiety and worry are associated with at least 3 of the following for more days than not: restlessness or feeling keyed up, easy fatigability, difficulty concentrating or mind going blank, irritability, muscle tension, and sleep disturbance.",
          "In children, only 1 associated symptom is required.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The anxiety, worry, or physical symptoms cause clinically significant distress or impairment.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The disturbance is not attributable to a substance or another medical condition.",
        ],
      },
      {
        title: "Criterion F",
        items: [
          "The disturbance is not better explained by another mental disorder such as panic disorder, social anxiety disorder, OCD, separation anxiety disorder, anorexia nervosa, or PTSD.",
        ],
      },
    ],
    scales: [
      { name: "GAD-7", use: "Most common brief outpatient severity tracker for generalized anxiety symptoms." },
      { name: "HAM-A", use: "Clinician-rated anxiety severity measure used in specialty settings and trials." },
      { name: "OASIS", use: "Short transdiagnostic measure of anxiety severity and impairment." },
    ],
    medications: [
      {
        section: "FDA-indicated medications commonly used for GAD",
        note:
          "FDA labeling for generalized anxiety disorder exists for select antidepressants and anxiolytics; verify product-specific age ranges and formulation details.",
        drugs: ["Escitalopram", "Paroxetine", "Duloxetine", "Venlafaxine XR"],
      },
    ],
    offLabelTreatments: ["Buspirone", "Pregabalin", "Mirtazapine"],
    interventionalOptions: [
      "TMS is being studied for anxiety disorders but is not standard first-line care.",
      "Ketamine is investigational for anxiety-spectrum symptoms in some settings.",
      "ECT is not a standard treatment for isolated GAD.",
    ],
  },
  {
    id: "panic-disorder",
    name: "Panic Disorder",
    category: "Anxiety Disorders",
    aliases: ["Panic attacks disorder"],
    searchTerms: ["panic attacks", "sudden fear", "agoraphobia overlap"],
    summary:
      "Panic disorder is more than having panic attacks. The syndrome becomes panic disorder when the attacks are recurrent, seem to come out of the blue, and leave behind ongoing fear, avoidance, or behavior change that starts organizing the person's life around the next attack.",
    highlights: [
      { label: "Unexpected attacks", text: "What makes this different from simple situational anxiety is that the attacks feel abrupt and are not always tied to the same obvious trigger." },
      { label: "Aftermath matters", text: "The aftermath is what makes the diagnosis. Patients often start scanning their body, avoiding places, or reorganizing routines out of fear of another attack." },
      { label: "Medical rule-outs", text: "Because the symptoms can look medical, it is important to think through cardiopulmonary, endocrine, vestibular, and substance-related explanations too." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Recurrent unexpected panic attacks occur.",
          "A panic attack is an abrupt surge of intense fear or intense discomfort that reaches a peak within minutes.",
          "During the surge, 4 or more symptoms occur such as palpitations, sweating, trembling, shortness of breath, feelings of choking, chest discomfort, nausea, dizziness, chills or heat sensations, paresthesias, derealization or depersonalization, fear of losing control, or fear of dying.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "At least one attack has been followed by 1 month or more of persistent concern or worry about additional attacks or their consequences.",
          "At least one attack has been followed by significant maladaptive behavior change related to the attacks, such as avoidance.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The disturbance is not attributable to a substance or another medical condition.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The disturbance is not better explained by another mental disorder such as social anxiety disorder, specific phobia, OCD, PTSD, or separation anxiety disorder.",
        ],
      },
    ],
    scales: [
      { name: "Panic Disorder Severity Scale", use: "Most common clinician-rated and self-report tool for panic disorder severity." },
      { name: "CGI-S", use: "Fast global severity impression during follow-up." },
    ],
    medications: [
      {
        section: "FDA-indicated medications commonly used for panic disorder",
        note:
          "Several SSRIs carry panic-disorder labeling; verify exact formulation and patient age indications in the current package insert.",
        drugs: ["Sertraline", "Paroxetine", "Fluoxetine"],
      },
    ],
    offLabelTreatments: ["Clonazepam", "Escitalopram", "Venlafaxine XR"],
    interventionalOptions: [
      "TMS is being explored for panic-spectrum symptoms.",
      "ECT is not standard for primary panic disorder.",
      "Ketamine remains investigational rather than routine care here.",
    ],
  },
  {
    id: "social-anxiety-disorder",
    name: "Social Anxiety Disorder",
    category: "Anxiety Disorders",
    aliases: ["Social phobia"],
    searchTerms: ["performance anxiety", "social phobia"],
    summary:
      "Social anxiety disorder is usually about being seen, judged, embarrassed, or exposed in front of other people. Some patients avoid those situations entirely, while others keep showing up but feel tense, preoccupied, and exhausted by the experience.",
    highlights: [
      { label: "Scrutiny theme", text: "The feared outcome is usually some form of negative evaluation, like embarrassment, rejection, humiliation, or visibly looking anxious." },
      { label: "Duration", text: "This tends to be a stable pattern, not just a bad week or a rough stretch before one important event." },
      { label: "Subtype thinking", text: "Some people fear only performance situations, while others struggle across much broader social and interpersonal settings." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Marked fear or anxiety occurs in one or more social situations involving possible scrutiny by others.",
          "The person fears acting in a way or showing anxiety symptoms that will be negatively evaluated.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The social situations almost always provoke fear or anxiety.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The social situations are avoided or endured with intense fear or anxiety.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The fear or anxiety is out of proportion to the actual threat posed by the social situation and the sociocultural context.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The fear, anxiety, or avoidance is persistent, typically lasting 6 months or more.",
        ],
      },
      {
        title: "Criterion F",
        items: [
          "The fear, anxiety, or avoidance causes clinically significant distress or impairment.",
        ],
      },
      {
        title: "Criterion G",
        items: [
          "The symptoms are not attributable to a substance or another medical condition.",
        ],
      },
      {
        title: "Criterion H",
        items: [
          "The disturbance is not better explained by another mental disorder.",
        ],
      },
      {
        title: "Criterion I",
        items: [
          "If another medical condition is present, the fear is clearly unrelated or excessive.",
        ],
      },
    ],
    scales: [
      { name: "Liebowitz Social Anxiety Scale", use: "Common clinician-rated or self-report scale for social fear and avoidance." },
      { name: "SPIN", use: "Brief self-report screen and severity tracker." },
    ],
    medications: [
      {
        section: "FDA-indicated medications commonly used for social anxiety disorder",
        note:
          "FDA labeling for social anxiety disorder exists for selected SSRIs and SNRIs; verify the specific product label before clinical use.",
        drugs: ["Paroxetine", "Sertraline", "Venlafaxine XR"],
      },
    ],
    offLabelTreatments: ["Escitalopram", "Fluvoxamine", "Gabapentin"],
    interventionalOptions: [
      "TMS is under study in social anxiety disorder.",
      "Ketamine is investigational for refractory anxiety symptoms.",
      "ECT is not standard for isolated social anxiety disorder.",
    ],
  },
  {
    id: "posttraumatic-stress-disorder",
    name: "Posttraumatic Stress Disorder",
    category: "Trauma- and Stressor-Related Disorders",
    aliases: ["PTSD"],
    searchTerms: ["trauma", "flashbacks", "nightmares", "hypervigilance"],
    summary:
      "PTSD develops after a qualifying trauma and often shows up as a mix of reliving, avoidance, emotional constriction, negative beliefs, hypervigilance, and a nervous system that no longer seems able to stand down.",
    highlights: [
      { label: "Exposure first", text: "The first question is always whether the trauma exposure actually meets diagnostic threshold, whether direct, witnessed, learned about, or repeatedly encountered in professional work." },
      { label: "Four symptom clusters", text: "Once exposure is established, it helps to organize the picture into intrusion, avoidance, negative mood-cognition changes, and arousal-reactivity symptoms." },
      { label: "Function matters", text: "The symptoms have to matter clinically. They should be causing distress, impairment, or both, and not be better explained by substances or medical illness." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Exposure to actual or threatened death, serious injury, or sexual violence occurs directly, by witnessing, by learning it happened to a close other, or through repeated exposure to aversive details in professional duties.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "One or more intrusion symptoms are present after the trauma, such as distressing memories, distressing dreams, dissociative reactions such as flashbacks, intense distress with reminders, or marked physiologic reactivity to reminders.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "Persistent avoidance of trauma-related stimuli is present, involving avoidance of memories-thoughts-feelings or avoidance of external reminders.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "Two or more negative changes in cognition or mood are present, such as inability to remember important aspects of the event, persistent negative beliefs, distorted blame, persistent negative emotional state, diminished interest, detachment, or inability to experience positive emotions.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "Two or more arousal or reactivity symptoms are present, such as irritability, reckless behavior, hypervigilance, exaggerated startle, poor concentration, or sleep disturbance.",
        ],
      },
      {
        title: "Criterion F",
        items: [
          "The disturbance lasts more than 1 month.",
        ],
      },
      {
        title: "Criterion G",
        items: [
          "The disturbance causes clinically significant distress or impairment.",
        ],
      },
      {
        title: "Criterion H",
        items: [
          "The disturbance is not attributable to substances or another medical condition.",
        ],
      },
    ],
    scales: [
      { name: "PCL-5", use: "Most common self-report PTSD severity measure mapped to DSM-5 symptom clusters." },
      { name: "CAPS-5", use: "Gold-standard structured clinician interview for diagnostic confirmation and severity." },
      { name: "PHQ-9", use: "Often paired to track comorbid depressive burden." },
    ],
    medications: [
      {
        section: "FDA-indicated medications commonly used for PTSD",
        note:
          "Among antidepressants, selected SSRIs carry PTSD labeling; other agents often used in practice may not have diagnosis-specific FDA approval.",
        drugs: ["Sertraline", "Paroxetine"],
      },
    ],
    offLabelTreatments: ["Prazosin", "Venlafaxine", "Mirtazapine"],
    interventionalOptions: [
      "TMS is under investigation for PTSD symptom clusters.",
      "Ketamine-assisted approaches are being studied for refractory PTSD.",
      "ECT may be considered in severe comorbid depression with PTSD rather than PTSD alone.",
    ],
  },
  {
    id: "bipolar-ii-disorder",
    name: "Bipolar II Disorder",
    category: "Bipolar and Related Disorders",
    aliases: ["Bipolar II", "Bipolar 2 disorder"],
    searchTerms: ["hypomania", "bipolar depression"],
    summary:
      "Bipolar II disorder lives in the space between recurrent depression and a history of unmistakable hypomania, without any true manic episode. In real life, many patients come to treatment because of depression, while the hypomanic periods are only recognized later in the story.",
    highlights: [
      { label: "No mania", text: "The boundary is important. If the person has ever had a full manic episode, the diagnosis is no longer bipolar II." },
      { label: "Hypomania threshold", text: "Hypomania still has to be a real episode. It lasts at least 4 days, is noticeable to others, and reflects a clear change from baseline." },
      { label: "Depressive burden", text: "Most of the suffering often comes from the depressive side, which is why bipolar II is so often missed early on." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "At least one hypomanic episode has occurred.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "At least one major depressive episode has occurred.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "There has never been a manic episode.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The occurrence of hypomanic and major depressive episodes is not better explained by schizophrenia-spectrum or other psychotic disorders.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "Symptoms cause clinically significant distress or impairment, largely through depressive symptoms or unpredictability of mood cycling.",
        ],
      },
      {
        title: "Hypomanic episode definition",
        items: [
          "A hypomanic episode is a distinct period of persistently elevated, expansive, or irritable mood together with persistently increased activity or energy.",
          "The episode lasts at least 4 consecutive days and is present most of the day, nearly every day.",
          "During the episode, 3 or more manic-type symptoms are present to a significant degree, or 4 if the mood is only irritable.",
          "The manic-type symptoms are grandiosity, decreased need for sleep, increased talkativeness, flight of ideas or racing thoughts, distractibility, increased goal-directed activity or psychomotor agitation, and excessive involvement in high-risk activities.",
          "The episode represents an unequivocal change in functioning that is uncharacteristic of the person when not symptomatic.",
          "The disturbance in mood and functioning is observable by others.",
          "The episode is not severe enough to cause marked impairment, require hospitalization, or include psychotic features.",
          "The episode is not attributable to a substance.",
        ],
      },
      {
        title: "Manic episode boundary",
        items: [
          "If a full manic episode occurs at any point, the diagnosis is no longer bipolar II disorder and instead falls within bipolar I disorder.",
        ],
      },
    ],
    scales: [
      { name: "CGI-BP", use: "Quick severity and improvement tracking across bipolar states." },
      { name: "YMRS", use: "Useful when hypomanic symptoms are active or suspected." },
      { name: "MADRS", use: "Helpful for monitoring the depressive pole over time." },
    ],
    medications: [
      {
        section: "FDA-indicated medications used in bipolar depression or maintenance contexts relevant to bipolar II",
        note:
          "FDA labels are not always bipolar-II-specific, but these agents are commonly drawn from bipolar depression and maintenance indications; verify the exact product labeling.",
        drugs: ["Quetiapine", "Lurasidone", "Cariprazine", "Lumateperone", "Lamotrigine"],
      },
    ],
    offLabelTreatments: ["Lithium", "Valproate", "Lamotrigine"],
    interventionalOptions: [
      "ECT is used for severe bipolar depression or mixed states.",
      "Ketamine is being studied and used selectively in refractory bipolar depression.",
      "TMS is under study and sometimes used off-label in bipolar depression.",
    ],
  },
  {
    id: "autism-spectrum-disorder",
    name: "Autism Spectrum Disorder",
    category: "Neurodevelopmental Disorders",
    aliases: ["ASD", "Autism"],
    searchTerms: ["autism", "social communication", "restricted interests"],
    summary:
      "Autism spectrum disorder is best understood as a developmental pattern involving persistent social-communication differences alongside restricted or repetitive behaviors, interests, routines, or sensory styles. The presentation can look very different from one person to another, which is why context and support needs matter so much.",
    highlights: [
      { label: "Two-domain model", text: "The evaluation usually comes back to two broad areas: social communication and restricted or repetitive patterns of behavior." },
      { label: "Developmental onset", text: "The pattern starts early, even if it becomes more visible only when social or adaptive demands increase." },
      { label: "Severity framing", text: "Support needs vary widely, so adaptive functioning and day-to-day context matter more than any one single trait." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Persistent deficits in social-emotional reciprocity are present.",
          "Persistent deficits in nonverbal communicative behaviors used for social interaction are present.",
          "Persistent deficits in developing, maintaining, and understanding relationships are present.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "At least 2 restricted or repetitive behavior features are present, such as stereotyped movements or speech, insistence on sameness or inflexible routines, highly restricted interests, or hyper- or hyporeactivity to sensory input.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "Symptoms are present in the early developmental period.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "Symptoms cause clinically significant impairment.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The disturbances are not better explained by intellectual disability alone, although the two may co-occur.",
        ],
      },
    ],
    scales: [
      { name: "ADOS-2", use: "Structured observational assessment used in comprehensive autism evaluations." },
      { name: "SRS-2", use: "Measures social responsiveness and autistic traits across settings." },
      { name: "Vineland-3", use: "Tracks adaptive functioning and support needs." },
    ],
    medications: [
      {
        section: "FDA-indicated medications for irritability associated with autism",
        note:
          "Medication does not treat the core social-communication syndrome directly; current diagnosis-specific FDA labeling primarily targets associated irritability.",
        drugs: ["Risperidone", "Aripiprazole"],
      },
    ],
    offLabelTreatments: ["Guanfacine", "Clonidine", "SSRIs for comorbid symptoms"],
    interventionalOptions: [
      "No established interventional psychiatry modality targets the core ASD syndrome.",
      "Neuromodulation approaches remain investigational.",
      "ECT is generally reserved for specific severe comorbid syndromes such as catatonia or aggression.",
    ],
  },
  {
    id: "anorexia-nervosa",
    name: "Anorexia Nervosa",
    category: "Feeding and Eating Disorders",
    aliases: ["AN"],
    searchTerms: ["restricting", "low weight", "fear of weight gain"],
    summary:
      "Anorexia nervosa is not just low weight. It is a pattern of restriction, fear of weight gain, and body-image distortion that pulls eating, identity, and self-evaluation into a narrow and often dangerous cycle.",
    highlights: [
      { label: "Low weight required", text: "Significantly low weight remains part of the core diagnosis, so the syndrome is not defined by thoughts alone." },
      { label: "Psychological drivers", text: "The fear of weight gain and the distorted relationship to body shape help distinguish anorexia from other causes of weight loss." },
      { label: "Subtype thinking", text: "It is still helpful to ask whether the picture is primarily restrictive or whether binge-purge behaviors are also part of it." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Restriction of energy intake leads to significantly low body weight in the context of age, sex, developmental trajectory, and physical health.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "There is intense fear of gaining weight or becoming fat, or persistent behavior that interferes with weight gain.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "There is disturbance in body-weight or shape experience, undue influence of body weight or shape on self-evaluation, or persistent lack of recognition of the seriousness of low body weight.",
        ],
      },
    ],
    scales: [
      { name: "EDE-Q", use: "Common self-report eating-disorder symptom measure." },
      { name: "Eating Disorder Examination", use: "Structured interview for diagnostic clarification and symptom severity." },
      { name: "BMI and medical monitoring", use: "Not a psychiatric scale, but essential for severity and medical risk framing." },
    ],
    medications: [
      {
        section: "Diagnosis-specific FDA indications",
        note:
          "This prototype does not list a core anorexia-nervosa-specific FDA medication indication; treatment is centered on nutritional rehabilitation, psychotherapy, and medical stabilization. Verify current labeling for any symptom-targeted use.",
        drugs: [],
      },
    ],
    offLabelTreatments: ["Olanzapine", "Fluoxetine for comorbid symptoms", "Mirtazapine"],
    interventionalOptions: [
      "ECT may be considered in severe comorbid depression or life-threatening psychiatric deterioration.",
      "Ketamine is not a standard anorexia treatment and remains investigational.",
      "TMS is under study but not established for anorexia nervosa.",
    ],
  },
  {
    id: "bulimia-nervosa",
    name: "Bulimia Nervosa",
    category: "Feeding and Eating Disorders",
    aliases: ["BN"],
    searchTerms: ["bingeing", "purging"],
    summary:
      "Bulimia nervosa usually looks like a painful cycle of binge eating followed by attempts to undo the binge through purging, fasting, overexercise, or other compensatory behaviors. Shame, secrecy, and shape-weight overvaluation are often central to how the illness is experienced.",
    highlights: [
      { label: "Binge plus compensation", text: "Both parts matter. The diagnosis requires loss-of-control binge episodes and compensatory behavior afterward." },
      { label: "Frequency threshold", text: "The pattern has to be recurring, not occasional. DSM threshold is at least weekly for 3 months." },
      { label: "Differential", text: "One of the main distinctions is whether the person is currently at significantly low weight, which may shift the frame toward anorexia nervosa." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Recurrent episodes of binge eating occur.",
          "A binge episode involves eating, in a discrete period, an amount that is definitely larger than most people would eat in similar circumstances.",
          "There is also a sense of lack of control over eating during the episode.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "Recurrent inappropriate compensatory behaviors occur to prevent weight gain, such as vomiting, laxatives, fasting, or excessive exercise.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The binge eating and compensatory behaviors occur at least once a week for 3 months.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "Self-evaluation is unduly influenced by body shape and weight.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The disturbance does not occur exclusively during episodes of anorexia nervosa.",
        ],
      },
    ],
    scales: [
      { name: "EDE-Q", use: "Tracks binge, purge, restraint, and shape-weight concerns." },
      { name: "Eating Disorder Examination", use: "Structured interview for severity and diagnostic detail." },
    ],
    medications: [
      {
        section: "FDA-indicated medication for bulimia nervosa",
        note:
          "Among antidepressants, fluoxetine has the clearest diagnosis-specific FDA indication for bulimia nervosa.",
        drugs: ["Fluoxetine"],
      },
    ],
    offLabelTreatments: ["Topiramate", "Ondansetron", "Sertraline"],
    interventionalOptions: [
      "TMS is being studied in eating disorders but is not established standard care.",
      "Ketamine remains investigational in bulimia-related symptoms.",
      "ECT is not standard unless severe comorbid mood illness drives the indication.",
    ],
  },
  {
    id: "binge-eating-disorder",
    name: "Binge-Eating Disorder",
    category: "Feeding and Eating Disorders",
    aliases: ["BED"],
    searchTerms: ["loss of control eating", "binge eating"],
    summary:
      "Binge-eating disorder centers on recurrent loss-of-control eating that feels distressing and hard to stop, but without the regular purging or compensatory behaviors seen in bulimia nervosa. Patients often describe shame, secrecy, and feeling disconnected from hunger or fullness cues.",
    highlights: [
      { label: "No regular compensatory behaviors", text: "That is the major dividing line from bulimia nervosa and helps keep the diagnosis conceptually clean." },
      { label: "Distress required", text: "The person has to be meaningfully distressed by the binge eating, not just overeating from time to time." },
      { label: "Frequency threshold", text: "The episodes need to recur often enough to form a syndrome, with DSM threshold set at least weekly for 3 months." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Recurrent binge eating episodes occur.",
          "A binge episode involves eating, in a discrete period, an amount that is definitely larger than most people would eat in similar circumstances.",
          "There is also a sense of lack of control over eating during the episode.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The binge episodes are associated with at least 3 of the following: eating much more rapidly than normal, eating until uncomfortably full, eating large amounts when not physically hungry, eating alone because of embarrassment, or feeling disgusted, depressed, or very guilty afterward.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "There is marked distress regarding binge eating.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The pattern occurs at least once a week for 3 months.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The binge eating is not associated with regular compensatory behaviors and does not occur exclusively during bulimia nervosa or anorexia nervosa.",
        ],
      },
    ],
    scales: [
      { name: "BES", use: "Brief self-report tool for binge-eating severity." },
      { name: "EDE-Q", use: "Useful when broader eating-disorder symptom tracking is needed." },
    ],
    medications: [
      {
        section: "FDA-indicated medication for binge-eating disorder",
        note:
          "Lisdexamfetamine has diagnosis-specific FDA labeling for moderate to severe binge-eating disorder in adults.",
        drugs: ["Lisdexamfetamine"],
      },
    ],
    offLabelTreatments: ["Topiramate", "SSRIs for comorbid symptoms", "Naltrexone combinations under study"],
    interventionalOptions: [
      "TMS is under study in binge-eating disorder.",
      "Ketamine is investigational rather than standard care.",
      "ECT is not a standard BED intervention.",
    ],
  },
  {
    id: "alcohol-use-disorder",
    name: "Alcohol Use Disorder",
    category: "Substance-Related and Addictive Disorders",
    aliases: ["AUD"],
    searchTerms: ["alcohol dependence", "problem drinking"],
    summary:
      "Alcohol use disorder is the pattern that emerges when drinking stops being just a habit and starts causing loss of control, relationship strain, role failure, risky behavior, craving, tolerance, or withdrawal. The diagnosis becomes more convincing when use keeps going despite obvious consequences.",
    highlights: [
      { label: "Severity count", text: "Severity is count-based in DSM, so it helps to explicitly ask through the full checklist rather than relying on a general impression." },
      { label: "Withdrawal matters", text: "A safe assessment has to include withdrawal risk, medical complications, and whether the person may need a higher level of care." },
      { label: "Medication role", text: "Medication is usually about reducing craving, helping maintain abstinence, or making relapse less likely, not treating intoxication itself." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Alcohol is often taken in larger amounts or over a longer period than intended.",
          "There is a persistent desire or unsuccessful efforts to cut down or control alcohol use.",
          "A great deal of time is spent obtaining alcohol, using alcohol, or recovering from its effects.",
          "Craving, or a strong desire or urge to use alcohol, is present.",
          "Recurrent alcohol use results in failure to fulfill major role obligations at work, school, or home.",
          "Alcohol use continues despite persistent or recurrent social or interpersonal problems caused or worsened by alcohol.",
          "Important social, occupational, or recreational activities are given up or reduced because of alcohol use.",
          "Recurrent alcohol use occurs in situations in which it is physically hazardous.",
          "Alcohol use continues despite knowledge of a persistent or recurrent physical or psychological problem likely caused or worsened by alcohol.",
          "Tolerance is present, defined by needing markedly increased amounts for intoxication or diminished effect with continued use of the same amount.",
          "Withdrawal is present, defined by the characteristic withdrawal syndrome or using alcohol to relieve or avoid withdrawal symptoms.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "At least 2 of the criterion A symptoms occur within the same 12-month period.",
        ],
      },
      {
        title: "Severity Specifier",
        items: [
          "Severity is mild with 2 to 3 symptoms, moderate with 4 to 5 symptoms, and severe with 6 or more symptoms.",
        ],
      },
    ],
    scales: [
      { name: "AUDIT", use: "Common screening and severity tool for unhealthy alcohol use." },
      { name: "CIWA-Ar", use: "Used when monitoring alcohol withdrawal severity." },
      { name: "Timeline Follow-Back", use: "Helps quantify drinking patterns over time." },
    ],
    medications: [
      {
        section: "FDA-indicated medications for alcohol use disorder",
        note:
          "Diagnosis-specific FDA-approved pharmacotherapies for alcohol-use disorder focus on relapse prevention or deterrence.",
        drugs: ["Naltrexone", "Acamprosate", "Disulfiram"],
      },
    ],
    offLabelTreatments: ["Topiramate", "Gabapentin", "Baclofen"],
    interventionalOptions: [
      "Ketamine-assisted psychotherapy is being explored in addiction treatment research.",
      "TMS is under study for craving reduction and relapse prevention.",
      "ECT is not a standard treatment for alcohol use disorder itself.",
    ],
  },
  {
    id: "borderline-personality-disorder",
    name: "Borderline Personality Disorder",
    category: "Personality Disorders",
    aliases: ["BPD"],
    searchTerms: ["affective instability", "self harm", "abandonment"],
    summary:
      "Borderline personality disorder is usually experienced as instability that touches nearly everything: relationships, identity, mood, anger, impulsivity, and the ability to feel steady from one moment to the next. The pattern is broad, longstanding, and often most visible under interpersonal stress.",
    highlights: [
      { label: "Pattern across settings", text: "The diagnosis is about a pervasive pattern, not a single crisis, breakup, or emotionally intense week." },
      { label: "Risk assessment", text: "Self-harm, suicidality, dissociation, substance use, and impulsive behavior need repeated and careful assessment over time." },
      { label: "Medication limits", text: "Medication may help with pieces of the picture, but psychotherapy remains the center of treatment for the disorder itself." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "A pervasive pattern of instability in interpersonal relationships, self-image, and affects, with marked impulsivity, begins by early adulthood and is present across contexts.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "At least 5 of the following are present: frantic efforts to avoid abandonment, unstable intense relationships, identity disturbance, impulsivity in potentially self-damaging areas, recurrent suicidal behavior or self-injury, affective instability, chronic emptiness, intense anger, or transient stress-related paranoia or dissociation.",
        ],
      },
    ],
    scales: [
      { name: "MSI-BPD", use: "Brief screening instrument for borderline personality features." },
      { name: "ZAN-BPD", use: "Clinician-rated severity measure for borderline symptom domains." },
    ],
    medications: [
      {
        section: "Diagnosis-specific FDA indications",
        note:
          "This prototype does not list a core borderline-personality-disorder-specific FDA medication indication; medication use is generally symptom- or comorbidity-targeted. Verify current labeling for any off-label strategy.",
        drugs: [],
      },
    ],
    offLabelTreatments: ["Lamotrigine", "Aripiprazole", "Omega-3 fatty acid augmentation"],
    interventionalOptions: [
      "Interventional psychiatry is not standard for borderline personality disorder itself.",
      "ECT may be used for severe comorbid mood syndromes, not for core BPD.",
      "TMS and ketamine are being explored mainly for comorbid affective symptoms.",
    ],
  },
  {
    id: "insomnia-disorder",
    name: "Insomnia Disorder",
    category: "Sleep-Wake Disorders",
    aliases: ["Chronic insomnia", "Insomnia"],
    searchTerms: ["sleep onset insomnia", "sleep maintenance insomnia", "early morning awakening"],
    summary:
      "Insomnia disorder is the pattern of not being able to fall asleep, stay asleep, or get back to sleep in a way that actually affects daytime life. The diagnosis becomes more convincing when the sleep complaint is persistent, happens despite adequate opportunity to sleep, and starts showing up as fatigue, irritability, poor concentration, or reduced functioning.",
    highlights: [
      { label: "Opportunity matters", text: "A patient can only meet criteria if there is enough time and a reasonable setting for sleep. Chronic sleep deprivation from schedule alone is not the same thing." },
      { label: "Daytime impact", text: "The complaint should not stop at the night. Daytime fatigue, mood change, cognitive problems, or functional impairment help make it a disorder rather than a preference or nuisance." },
      { label: "Clinical frame", text: "It helps to ask whether the problem is with sleep onset, sleep maintenance, early morning awakening, or a mix of all three, because that often changes management." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "There is a predominant complaint of dissatisfaction with sleep quantity or quality.",
          "The complaint takes the form of difficulty initiating sleep, difficulty maintaining sleep with frequent awakenings or trouble returning to sleep, or early-morning awakening with inability to return to sleep.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The sleep disturbance causes clinically significant distress or impairment in social, occupational, educational, academic, behavioral, or other important areas of functioning.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The sleep difficulty occurs at least 3 nights per week.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The sleep difficulty has been present for at least 3 months.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The sleep difficulty occurs despite adequate opportunity for sleep.",
        ],
      },
      {
        title: "Criterion F",
        items: [
          "The insomnia is not better explained by another sleep-wake disorder.",
        ],
      },
      {
        title: "Criterion G",
        items: [
          "The insomnia is not attributable to a substance or medication.",
        ],
      },
      {
        title: "Criterion H",
        items: [
          "Coexisting mental disorders and medical conditions do not adequately explain the predominant insomnia complaint.",
        ],
      },
    ],
    scales: [
      { name: "Insomnia Severity Index", use: "Most common brief measure for insomnia severity and treatment response." },
      { name: "Pittsburgh Sleep Quality Index", use: "Useful when you want a broader view of sleep quality and sleep-related impairment." },
      { name: "Sleep diary", use: "Essential for mapping sleep onset, awakenings, total sleep time, and patterns over time." },
    ],
    medications: [
      {
        section: "FDA-approved medications for insomnia",
        note:
          "These medications have insomnia-related FDA labeling, although the exact indication may target sleep onset, sleep maintenance, or both depending on the product.",
        drugs: ["Zolpidem", "Eszopiclone", "Zaleplon", "Suvorexant", "Lemborexant", "Ramelteon", "Doxepin", "Temazepam", "Triazolam"],
      },
    ],
    offLabelTreatments: ["Trazodone", "Mirtazapine", "Gabapentin"],
    interventionalOptions: [
      "CBT-I remains the first-line nonpharmacologic intervention and is central to management.",
      "TMS and other interventional psychiatry approaches are not standard treatments for insomnia disorder itself.",
      "Ketamine and ECT are not standard insomnia interventions.",
    ],
  },
  {
    id: "hypersomnolence-disorder",
    name: "Hypersomnolence Disorder",
    category: "Sleep-Wake Disorders",
    aliases: ["Hypersomnia disorder", "Hypersomnolence"],
    searchTerms: ["excessive sleepiness", "long sleep", "sleep inertia"],
    summary:
      "Hypersomnolence disorder is about excessive sleepiness that persists even when the person appears to be getting enough main sleep. Patients often describe long, unrefreshing sleep, trouble getting fully awake, or repeated daytime sleep episodes that interfere with work, school, or safety.",
    highlights: [
      { label: "Not just tired", text: "This diagnosis is about true sleepiness rather than low energy alone, so it helps to separate sleepiness from depression, burnout, and medication side effects." },
      { label: "Duration", text: "The problem needs to be recurrent and persistent, not just a short period of catch-up sleep after deprivation." },
      { label: "Rule-outs", text: "Sleep deprivation, sleep apnea, circadian disruption, substance effects, and narcolepsy all need to be considered carefully before landing here." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Self-reported excessive sleepiness occurs despite a main sleep period lasting at least 7 hours.",
          "The excessive sleepiness is accompanied by recurrent periods of sleep or lapses into sleep within the same day, a main sleep episode lasting more than 9 hours that is not restorative, or difficulty being fully awake after abrupt awakening.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The hypersomnolence occurs at least 3 times per week for at least 3 months.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The hypersomnolence causes significant distress or impairment.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The hypersomnolence is not better explained by another sleep disorder and does not occur exclusively during the course of another sleep disorder.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "The hypersomnolence is not attributable to a substance or medication.",
        ],
      },
      {
        title: "Criterion F",
        items: [
          "Coexisting mental or medical disorders do not adequately explain the predominant hypersomnolence complaint.",
        ],
      },
    ],
    scales: [
      { name: "Epworth Sleepiness Scale", use: "Quick self-report gauge of daytime sleepiness in common situations." },
      { name: "Sleep diary", use: "Helps clarify whether the issue is true hypersomnolence or chronic sleep restriction." },
      { name: "Multiple Sleep Latency Test", use: "Useful in specialist workup when narcolepsy or other central hypersomnia is being considered." },
    ],
    medications: [
      {
        section: "Diagnosis-specific FDA indications",
        note:
          "This prototype does not list a core DSM hypersomnolence-disorder-specific FDA medication indication; treatment usually depends on the underlying sleep diagnosis and specialist evaluation.",
        drugs: [],
      },
    ],
    offLabelTreatments: ["Modafinil", "Armodafinil", "Solriamfetol"],
    interventionalOptions: [
      "Interventional psychiatry modalities are not standard treatments for hypersomnolence disorder.",
      "Management is usually based on sleep medicine workup, schedule correction, and cause-specific treatment.",
      "ECT, TMS, and ketamine are not standard therapies here.",
    ],
  },
  {
    id: "narcolepsy",
    name: "Narcolepsy",
    category: "Sleep-Wake Disorders",
    aliases: ["Narcolepsy type 1", "Narcolepsy type 2"],
    searchTerms: ["cataplexy", "sleep attacks", "hypocretin", "orexin"],
    summary:
      "Narcolepsy is a central disorder of sleep-wake regulation marked by chronic daytime sleepiness and, in some patients, cataplexy, REM-related hallucinations, sleep paralysis, or fragmented nighttime sleep. In practice, the story often comes out as irresistible sleep episodes and a lifetime of feeling abnormally sleepy.",
    highlights: [
      { label: "Core symptom", text: "Excessive daytime sleepiness is the anchor symptom. The person is often sleepy even after what sounds like adequate nighttime sleep." },
      { label: "Cataplexy matters", text: "When present, cataplexy strongly shifts the differential and points toward narcolepsy type 1." },
      { label: "Workup", text: "Diagnosis usually depends on sleep medicine testing, especially polysomnography plus MSLT, and sometimes CSF hypocretin data." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "There are recurrent periods of irrepressible need to sleep, lapsing into sleep, or napping within the same day.",
          "These episodes occur at least 3 times per week over the past 3 months.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "At least one of the following is present: episodes of cataplexy, hypocretin deficiency, or REM sleep latency abnormalities on sleep testing consistent with narcolepsy.",
        ],
      },
    ],
    scales: [
      { name: "Epworth Sleepiness Scale", use: "Common office-based measure of subjective daytime sleepiness." },
      { name: "Multiple Sleep Latency Test", use: "Core specialist diagnostic test in narcolepsy evaluation." },
      { name: "Maintenance of Wakefulness Test", use: "Useful in follow-up when ability to stay awake is the key clinical question." },
    ],
    medications: [
      {
        section: "FDA-approved medications for excessive daytime sleepiness in narcolepsy",
        note:
          "Several wake-promoting agents and alerting medications carry narcolepsy labeling, though product-specific indications and age ranges differ.",
        drugs: ["Modafinil", "Armodafinil", "Solriamfetol", "Pitolisant"],
      },
      {
        section: "FDA-approved medications for cataplexy or mixed narcolepsy symptoms",
        note:
          "Oxybate products are important FDA-approved options when cataplexy or severe daytime sleepiness is part of the narcolepsy picture.",
        drugs: ["Sodium oxybate", "Low-sodium oxybate"],
      },
    ],
    offLabelTreatments: ["Methylphenidate", "Amphetamine formulations", "Venlafaxine for cataplexy"],
    interventionalOptions: [
      "Interventional psychiatry modalities are not standard treatments for narcolepsy.",
      "Management is usually behavioral plus medication-based within sleep medicine.",
      "ECT, TMS, and ketamine are not standard narcolepsy treatments.",
    ],
  },
  {
    id: "obstructive-sleep-apnea-hypopnea",
    name: "Obstructive Sleep Apnea Hypopnea",
    category: "Sleep-Wake Disorders",
    aliases: ["OSA", "Obstructive sleep apnea"],
    searchTerms: ["snoring", "apnea", "daytime sleepiness", "sleep-disordered breathing"],
    summary:
      "Obstructive sleep apnea hypopnea is a breathing-related sleep disorder in which airflow repeatedly narrows or stops during sleep, often leading to snoring, witnessed apneas, fragmented sleep, and daytime sleepiness. Many patients do not present saying they sleep badly. They present tired, foggy, hypertensive, or told by a partner that they stop breathing.",
    highlights: [
      { label: "History clues", text: "Snoring, witnessed apneas, gasping, morning headaches, and excessive daytime sleepiness are often the first clues." },
      { label: "Testing", text: "Diagnosis typically depends on sleep testing rather than interview alone." },
      { label: "Treatment frame", text: "Primary treatment is not psychiatric. Airway-based treatment and sleep medicine management come first, with medication playing a narrower role." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "Either there is evidence by polysomnography of at least 5 obstructive apneas or hypopneas per hour of sleep and associated symptoms, or polysomnography shows 15 or more obstructive apneas or hypopneas per hour even without symptoms.",
          "Associated symptoms may include nocturnal breathing disturbances, snoring, snorting, gasping, breathing pauses during sleep, daytime sleepiness, fatigue, or nonrestorative sleep.",
        ],
      },
    ],
    scales: [
      { name: "STOP-Bang", use: "Common screening tool for obstructive sleep apnea risk." },
      { name: "Epworth Sleepiness Scale", use: "Useful for tracking daytime sleepiness burden." },
      { name: "Polysomnography metrics", use: "AHI and oxygen desaturation burden are central to confirmation and severity framing." },
    ],
    medications: [
      {
        section: "FDA-approved medications for residual excessive sleepiness associated with OSA",
        note:
          "Medication is not a replacement for airway treatment. These agents are used more narrowly for persistent excessive sleepiness in selected patients.",
        drugs: ["Modafinil", "Armodafinil", "Solriamfetol"],
      },
    ],
    offLabelTreatments: ["No routine off-label psychiatric medication pathway", "Weight-loss pharmacotherapy depending on comorbidity", "Adjunctive alerting agents in specialty care"],
    interventionalOptions: [
      "This is primarily a sleep medicine and airway disorder rather than an interventional psychiatry target.",
      "Positive airway pressure, oral appliances, and procedural airway approaches are the main treatment lanes.",
      "ECT, TMS, and ketamine are not treatments for OSA itself.",
    ],
  },
  {
    id: "circadian-rhythm-sleep-wake-disorder",
    name: "Circadian Rhythm Sleep-Wake Disorder",
    category: "Sleep-Wake Disorders",
    aliases: ["Circadian rhythm disorder", "Delayed sleep phase", "Shift work sleep disorder"],
    searchTerms: ["circadian", "sleep phase", "shift work", "non-24"],
    summary:
      "Circadian rhythm sleep-wake disorder is a mismatch between the person's internal clock and the sleep schedule that their life requires. Patients often say they can sleep, just not at the time they need to, and that distinction is often what separates circadian problems from primary insomnia.",
    highlights: [
      { label: "Clock mismatch", text: "The central issue is timing. The sleep pattern may work biologically, but it is misaligned with social or occupational demands." },
      { label: "Subtype matters", text: "Delayed sleep-wake phase, advanced phase, irregular sleep-wake rhythm, non-24-hour type, and shift-work type can look quite different in practice." },
      { label: "History first", text: "A careful sleep schedule history and sleep diary are often more helpful than a generic sleep complaint alone." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "There is a persistent or recurrent pattern of sleep disruption due primarily to alteration of the circadian system or misalignment between the endogenous circadian rhythm and the sleep-wake schedule required by the person's environment.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The sleep disruption leads to excessive sleepiness, insomnia, or both.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The sleep disturbance causes clinically significant distress or impairment.",
        ],
      },
    ],
    scales: [
      { name: "Sleep diary", use: "Most useful first tool for seeing the actual pattern across days and weeks." },
      { name: "Actigraphy", use: "Helpful when trying to document sleep timing and circadian pattern objectively." },
      { name: "Epworth Sleepiness Scale", use: "Useful if daytime sleepiness is prominent." },
    ],
    medications: [
      {
        section: "FDA-approved medication relevant to circadian disorders",
        note:
          "Tasimelteon has FDA labeling for non-24-hour sleep-wake disorder in blind adults. Other circadian interventions are often behavioral, light-based, or used off-label.",
        drugs: ["Tasimelteon"],
      },
    ],
    offLabelTreatments: ["Melatonin", "Ramelteon", "Wake-promoting agents in shift-work contexts"],
    interventionalOptions: [
      "Light therapy and schedule-based interventions are more central here than interventional psychiatry procedures.",
      "TMS, ketamine, and ECT are not standard treatments for circadian rhythm sleep-wake disorders.",
      "Care often depends on subtype-specific chronotherapy and behavioral planning.",
    ],
  },
  {
    id: "nightmare-disorder",
    name: "Nightmare Disorder",
    category: "Sleep-Wake Disorders",
    aliases: ["Nightmares", "Dream anxiety disorder"],
    searchTerms: ["nightmares", "disturbing dreams", "dream recall"],
    summary:
      "Nightmare disorder involves repeated, vividly remembered dysphoric dreams that typically center on threats to survival, safety, or physical integrity and leave the person alert and distressed after awakening. The diagnosis becomes clinically relevant when the dreams are recurrent enough to disrupt sleep, mood, or daytime functioning.",
    highlights: [
      { label: "Recall is usually clear", text: "Unlike some other parasomnias, patients usually awaken quickly and can recall the dream content in detail." },
      { label: "Daytime effect", text: "The dreams matter most clinically when they begin causing avoidance, sleep loss, anticipatory anxiety, or daytime impairment." },
      { label: "Context matters", text: "Trauma history, PTSD symptoms, medications, and substance use are important parts of the workup." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "There are repeated occurrences of extended, extremely dysphoric, and well-remembered dreams that usually involve efforts to avoid threats to survival, security, or physical integrity.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "On awakening from the dysphoric dreams, the person rapidly becomes oriented and alert.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The sleep disturbance causes clinically significant distress or impairment.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The nightmare symptoms are not attributable to a substance or medication.",
        ],
      },
      {
        title: "Criterion E",
        items: [
          "Coexisting mental and medical disorders do not adequately explain the predominant complaint of dysphoric dreams.",
        ],
      },
    ],
    scales: [
      { name: "Nightmare Frequency Questionnaire", use: "Useful when tracking recurrence and treatment response over time." },
      { name: "Pittsburgh Sleep Quality Index", use: "Helpful for broader sleep disruption around nightmares." },
      { name: "PCL-5", use: "Important when trauma-related nightmares are part of a broader PTSD picture." },
    ],
    medications: [
      {
        section: "Diagnosis-specific FDA indications",
        note:
          "This prototype does not list a core nightmare-disorder-specific FDA medication indication; management often depends on cause, trauma context, and sleep history.",
        drugs: [],
      },
    ],
    offLabelTreatments: ["Prazosin", "Clonidine", "Cyproheptadine in selected cases"],
    interventionalOptions: [
      "Imagery rehearsal therapy is often a more central intervention than medication alone.",
      "Interventional psychiatry procedures are not standard treatments for nightmare disorder itself.",
      "ECT, TMS, and ketamine are not standard nightmare-disorder treatments.",
    ],
  },
  {
    id: "restless-legs-syndrome",
    name: "Restless Legs Syndrome",
    category: "Sleep-Wake Disorders",
    aliases: ["RLS", "Willis-Ekbom disease"],
    searchTerms: ["restless legs", "urge to move legs", "worse at night"],
    summary:
      "Restless legs syndrome is the uncomfortable urge to move the legs that tends to get worse at rest, worse in the evening, and at least partly better with movement. Patients often describe it as a sleep problem, but the key experience is the sensory-motor discomfort that makes resting and falling asleep hard.",
    highlights: [
      { label: "Timing matters", text: "Symptoms classically worsen in the evening or at night, which helps separate RLS from many other causes of leg discomfort." },
      { label: "Movement helps", text: "Temporary relief with walking, stretching, or movement is a strong clue." },
      { label: "Medical review", text: "Iron deficiency, pregnancy, renal disease, neuropathy, and medication effects all deserve attention in the workup." },
    ],
    criteria: [
      {
        title: "Criterion A",
        items: [
          "There is an urge to move the legs, usually accompanied by or in response to uncomfortable and unpleasant sensations in the legs.",
          "The urge to move or unpleasant sensations begin or worsen during periods of rest or inactivity.",
          "The urge to move or unpleasant sensations are partially or totally relieved by movement.",
          "The urge to move or unpleasant sensations are worse in the evening or at night than during the day or occur only in the evening or at night.",
        ],
      },
      {
        title: "Criterion B",
        items: [
          "The symptoms in Criterion A occur at least 3 times per week and have persisted for at least 3 months.",
        ],
      },
      {
        title: "Criterion C",
        items: [
          "The symptoms are accompanied by significant distress or impairment.",
        ],
      },
      {
        title: "Criterion D",
        items: [
          "The symptoms are not attributable solely to another mental disorder, behavioral condition, substance effect, or medical condition.",
        ],
      },
    ],
    scales: [
      { name: "International Restless Legs Syndrome Rating Scale", use: "Standard measure for symptom severity and treatment response." },
      { name: "Sleep diary", use: "Helpful when symptoms are mainly discussed as difficulty settling or staying asleep." },
      { name: "Ferritin and iron studies", use: "Not a psychiatric scale, but often clinically essential in the workup." },
    ],
    medications: [
      {
        section: "FDA-approved medications for restless legs syndrome",
        note:
          "Several medications have FDA labeling for moderate to severe primary restless legs syndrome, with selection shaped by augmentation risk, sedation, and comorbidity.",
        drugs: ["Gabapentin enacarbil", "Pramipexole", "Ropinirole", "Rotigotine"],
      },
    ],
    offLabelTreatments: ["Pregabalin", "Gabapentin", "Iron replacement when indicated"],
    interventionalOptions: [
      "Interventional psychiatry modalities are not standard treatments for restless legs syndrome.",
      "Management usually depends on iron status, medication review, and sleep medicine or neurology-informed treatment.",
      "ECT, TMS, and ketamine are not standard RLS interventions.",
    ],
  },
];
