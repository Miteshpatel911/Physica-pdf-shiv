const express = require('express');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to save JSON data
app.post('/save-json', (req, res) => {
  // data = req.body;
  //  // Log the received data in a pretty JSON format
  //  console.log('Received JSON data:', JSON.stringify(data, null, 2));
  // res.status(200).send('Data saved successfully');

 
});

app.post('/generate-pdf', (req, res) => {
  // Load the JSON file dynamically
  // const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  // if (!data) {
  //   return res.status(400).send('No data available to generate PDF');
  // }
  let data;
  try {
    data = JSON.parse(fs.readFileSync('./data.json', 'utf8')); // Ensure the file path is correct
  } catch (err) {
    console.error('Error reading JSON file:', err.message);
    return res.status(400).send('Failed to load JSON data. Ensure the file exists and is properly formatted.');
  }
  if (!data) {
    return res.status(400).send('No data available to generate PDF');
  }

  const doc = new PDFDocument({ size: 'A4', margin: 0 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

  doc.pipe(res);

  const BGimagePath = './assets/Assessment_Report_Clean.jpg';
  const painLevelImagePath = `./assets/Pain-${data.pain_level}.png`; // Dynamic pain level image
  const callImagePath = './assets/call.png';
  const globalImagePath = './assets/global.png';
  const houseImagePath = './assets/house.png';

  doc.image(BGimagePath, 0, 0, { width: doc.page.width, height: doc.page.height });

  const scaleFactor = 1.05;
  doc.font('./assets/PlusJakartaSans-SemiBold.ttf');
  //doc.fillColor('#969696');

  // Add the header text
  doc.fontSize(8 * scaleFactor).fillColor('#333').text(`Name: ${data.patient_name}`, 15, 97);
  doc.fontSize(8 * scaleFactor).text(`Age/Sex: ${data.age}Y / ${data.gender}`, 202, 97);
  doc.fontSize(8 * scaleFactor).text(`Date Of Session: ${data.date}`, 388, 97);

  doc.fontSize(8 * scaleFactor).text(`Doctor: ${data.physiotherapist_name}`, 15, 117);
  doc.fontSize(8 * scaleFactor).text(`Patient ID: 1012`, 202, 117); // Add Patient ID dynamically if available
  doc.fontSize(8 * scaleFactor).text(`Date Of Report: 11/01/2025`, 388, 117);

  // doc.fontSize(8 * scaleFactor).text(`Surgery Type: ${data.surgery_type}`, 15, 138, { width: 170 });
  // doc.fontSize(8 * scaleFactor).text(`Date Of Surgery: ${data.date_of_surgery}`, 202, 138);

  // Horizontal line Section 1
  doc.strokeColor('#FF9318');
  doc.strokeOpacity(0.7);
  doc.lineWidth(0.2);  
  doc.moveTo(7, 173).lineTo(587, 173).stroke();

  // Primary Complaints
  doc.fontSize(10).text('Primary Complaints', 15, 189);
  doc.fontSize(8 * scaleFactor).text(data.primary_complaint, 15, 206, { width: 550 });

  // Diagnosis
  doc.fontSize(10).text('Diagnosis', 15, 246);
  doc.fontSize(8 * scaleFactor).text(data.differential_diagnosis, 15, 265, { width: 170 });

  // Pain Level and Pain Type
  doc.fontSize(10).text(`Pain Level: ${data.pain_level}/10`, 202, 246);
  doc.image(painLevelImagePath, 202, 265, { width: 135 });

  doc.fontSize(10).text('Neurological Symptoms', 388, 246);
const painTypeText = data.neurological_symptoms.join(', '); // Join the pain_type values with a comma
doc.fontSize(8 * scaleFactor).text(painTypeText, 388, 265, { width: 170 }); // Render the joined string on one line

 // Horizontal line Section 2
 doc.moveTo(7, 300).lineTo(587, 300).stroke();  


   // Physical Assessment Findings
   doc.fontSize(10).text('Physical Assessment Findings', 15, 318);

   // Collect physical findings dynamically from the new fields
   const physicalFindings = [
     `Affected Limbs: ${data.affected_limbs}`,
     `Muscle Strength: ${data.muscle_strength}`,
     `Reflexes: ${data.reflexes}`,
     `ROM(Active): ${data.range_of_motion_active}`,
     `ROM(Passive): ${data.range_of_motion_passive}`,
     `Muscle Tone: ${data.muscle_tone}`,
     `Dermatome Level: ${data.dermatome_level}`,
     `Myotome Level: ${data.myotome_level}`,
     `Crepitus: ${data.crepitus}`,
   ];
 
   const startX = [15, 202, 388]; // X coordinates for the three columns
   const startY = 340; // Initial Y coordinate
 
   physicalFindings.forEach((finding, index) => {
     // Determine the column (X) and row (Y)
     const column = index % 3; // This will determine the column: 0, 1, 2
     const row = Math.floor(index / 3); // This will determine the row: 0, 1, 2, etc.
 
     // Calculate the X and Y position
     const xPos = startX[column]; // Use the column to get the X position
     const yPos = startY + row * 20; // Add row offset to Y position
 
     // Add the finding text at the calculated position
     doc.fontSize(8 * scaleFactor).text(finding, xPos, yPos);
   });

  // // Add Positive Special Tests
  // doc.fontSize(10).text('Positive Special Tests', 15, 450).fontSize(10);
  // doc.fontSize(8 * scaleFactor).text('McMurray test - Mild Pain', 15, 472, { width: 170 });// Add dynamically if available
  // // Add Neurological Symptoms
  // doc.fontSize(10).text('Neurological Symptoms', 388, 450);
  // doc.fontSize(8 * scaleFactor).text('None', 388, 472, { width: 170 });// Add dynamically if available

  doc.fontSize(10).text('Gait Assessment', 15, 413).fontSize(10);
  const gaitAssessment = data.gait_assessment.join(', '); // Join the pain_type values with a comma
  doc.fontSize(8 * scaleFactor).text(gaitAssessment, 15, 435, { width: 170 }); // Render the joined string on one line

 // Functional Limitations
// doc.fontSize(10).text('Functional Limitations', 202, 450);
// const funlimTypeText = data.functional_limitations.join(', ');
// doc.fontSize(8 * scaleFactor).text(funlimTypeText, 202, 472, { width: 170 });

 // Horizontal line Section 3
 doc.moveTo(7, 512).lineTo(587, 512).stroke();  

  // Treatment Duration
  doc.fontSize(10).text('Treatment Duration', 15, 530);
  doc.fontSize(8 * scaleFactor).text('6 weeks|2 to 3 sessions per week.', 15, 547, { width: 170 });

  // Modalities
  doc.fontSize(10).text('Modalities', 202, 530);
  doc.fontSize(8 * scaleFactor).text(data.modalities_used, 202, 547, { width: 170 });

  // Additional Assistive Aids
  doc.fontSize(10).text('Additional Assistive Aids', 388, 530);
  doc.fontSize(8 * scaleFactor).text(data.assistive_aids, 388, 547, { width: 170 });

  //Treatment Plan
  doc.fontSize(10).text('Treatment Plan', 15, 575);
  doc.fontSize(8 * scaleFactor).text(data.treatment_plan, 15, 592, { width: 550 });

  // Horizontal line Section 3
  doc.moveTo(7, 626).lineTo(587, 626).stroke(); 

  // Additional Notes
  doc.fontSize(10).text('Additional Notes', 15, 642);
  doc.fontSize(8 * scaleFactor).text(data.additional_notes, 15, 658, { width: 550 });

  // Additional Notes
  doc.fontSize(10).text(`Doctor's Prescription`, 15, 698);
  doc.fontSize(8 * scaleFactor).text(data.doctor_prescription, 15, 716, { width: 550 });
  

  // Footer
  doc.fontSize(7 * 1.155).text('Physica Healthtech Private Limited', 15, 780);
  doc.image(houseImagePath, 12, 798, { width: 10 });
  doc.fontSize(6 * 1.25).text('386 Sane Guruji Premises, Veer Savarkar Marg, Prabhadevi, Mumbai 400025', 27, 800);
  doc.image(globalImagePath, 12, 815, { width: 10 });
  doc.fontSize(6 * 1.3).text('www.physica.fit', 27, 815);
  doc.image(callImagePath, 139, 815, { width: 10 });
  doc.fontSize(6 * 1.2).text('+91 9892260450', 153, 815);

  // doc.fontSize(8 * scaleFactor).text(`E`, 580, 832);
  doc.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
