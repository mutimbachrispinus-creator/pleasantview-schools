import Page from '@/components/Page';
import { getSchool } from '@/lib/db';
export default async function Academics({ params }) {
  const s = await getSchool((await params).school);
  return <Page title={s.name + ': Academics (CBE)'}>
    <p>{s.level ? `${s.level}. ` : ''}We follow Kenya&apos;s Competency Based Curriculum, assessing what learners can do, not only what they know.</p>
    <h3>Pre-Primary &amp; Lower Primary (PP1–Grade 3)</h3><p>Literacy, numeracy, creative activities, environmental and Christian religious education.</p>
    <h3>Upper Primary (Grades 4–6)</h3><p>English, Kiswahili, Mathematics, Science &amp; Technology, Social Studies, Agriculture, Creative Arts, PHE.</p>
    <h3>Junior School (Grades 7–9)</h3><p>Integrated Science, Pre-Technical Studies, Business Studies, Computer Science and more, leading to KJSEA.</p>
    <h3>Senior School (Grades 10–12)</h3><p>Pathways: STEM, Social Sciences, and Arts &amp; Sports Science.</p>
    <h3>Core Competencies</h3><ul><li>Communication &amp; collaboration</li><li>Critical thinking &amp; problem solving</li><li>Creativity &amp; imagination</li><li>Citizenship, digital literacy, learning to learn, self-efficacy</li></ul>
  </Page>;
}
