import { ArrowDown, ArrowRight, CheckCircle2, ClipboardCheck, Cpu, Factory, Route, TriangleAlert } from "lucide-react";

export function StoryIntro(){
  return <>
    <nav className="story-nav" aria-label="Demo walkthrough">
      {[['problem','01','The problem'],['approach','02','Our approach'],['details','03','Work through it'],['result','04','See the result']].map(([id,n,label])=><a key={id} href={`#${id}`}><span>{n}</span>{label}<ArrowRight size={13}/></a>)}
    </nav>
    <section className="story-hero" id="problem" aria-labelledby="problem-title">
      <div className="story-copy">
        <p className="overline">01 / THE PROBLEM</p>
        <h1>A machine stops.<br/><span>The deadlines don't.</span></h1>
        <p className="story-lead">A workshop supervisor has a broken mill, late stock and orders due today. Which jobs can move to another machine? Which promises are now impossible?</p>
        <p className="story-purpose">LineMend turns that handover into a recovery plan you can check before changing the day's work.</p>
        <a className="button accent" href="#approach">See how we solve it <ArrowDown size={15}/></a>
      </div>
      <aside className="problem-note" aria-label="Fictional workshop problem">
        <div className="problem-note-heading"><span><Factory size={17}/> ALDER WORKS</span><span>09:30</span></div>
        <div className="problem-note-alert"><TriangleAlert size={18}/><strong>The morning plan just changed.</strong></div>
        <blockquote>"CNC-1 is down until 13:00. The material for J106 won't arrive until 12:30."</blockquote>
        <div className="problem-facts"><span><strong>8</strong>orders due</span><span><strong>3</strong>workcells</span><span><strong>1</strong>disrupted shift</span></div>
        <p>The note explains what happened.<br/><strong>The supervisor still needs a workable plan.</strong></p>
        <small>Fictional workshop used throughout this demo.</small>
      </aside>
    </section>
    <section className="story-approach" id="approach" aria-labelledby="approach-title">
      <div className="story-section-heading"><div><p className="overline">02 / OUR APPROACH</p><h2>Read the change. Check it. Rebuild the plan.</h2></div><a href="#details">Work through the example <ArrowDown size={14}/></a></div>
      <div className="approach-grid">
        <article><span className="approach-icon"><Cpu size={21}/></span><div><h3>AI reads the handover</h3><p>NVIDIA Nemotron on Nebius Token Factory turns the note into machine downtime, material arrivals and deadlines, each with a source quote.</p></div></article>
        <article><span className="approach-icon"><ClipboardCheck size={21}/></span><div><h3>You check the assumptions</h3><p>Review the quoted times and jobs. Correct a constraint before it affects the plan. If the note is unclear, the app asks a question.</p></div></article>
        <article><span className="approach-icon"><Route size={21}/></span><div><h3>The scheduler checks the options</h3><p>Try compatible machines and job orders. Keep completed work in place, compare with the old queue and show any deadline that cannot be met.</p></div></article>
      </div>
      <div className="approach-footnote"><CheckCircle2 size={14}/><span>The output is a proposal for the supervisor to review. No machine is controlled by this app.</span></div>
    </section>
  </>;
}
