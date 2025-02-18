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
  // doc.fontSize(10).text('Primary Complaints', 15, 189);
  // doc.fontSize(8 * scaleFactor).text(data.primary_complaint, 15, 206, { width: 550 });

  // Reason for Referral
  
  doc.fontSize(10).text('Reason for referral', 15, 189);
  doc.fontSize(8 * scaleFactor).text(data.reason_for_referral, 15, 206, { width: 550 });
  // Diagnosis
  // doc.fontSize(10).text('Diagnosis', 15, 246);
  // doc.fontSize(8 * scaleFactor).text(data.differential_diagnosis, 15, 265, { width: 170 });
  //Vital Signs
  // doc.fontSize(10).text('Vital Signs', 15, 189);

  // doc.fontSize(8).text('Heart Rate:', 15, 210);
  // doc.fontSize(8 * scaleFactor).text(data.heart_rate, 61, 210, { width: 550 });
  // doc.fontSize(8).text('Respiratory Rate:', 15, 228);
  // doc.fontSize(8 * scaleFactor).text(data.respiratory_rate, 85, 228, { width: 550 });
  // doc.fontSize(8).text('SpO2:', 15, 246);
  // doc.fontSize(8 * scaleFactor).text(data.spO2, 42, 246, { width: 550 });
  // doc.fontSize(8).text('Blood Pressure:', 15, 265);
  // doc.fontSize(8 * scaleFactor).text(data.blood_pressure, 80, 265, { width: 550 });

  // Development Milestones
  doc.fontSize(10).text('Development Milestones', 15, 246);
  doc.fontSize(8 * scaleFactor).text(data.development_milestones, 15, 265, { width: 170 });

  // Pain Level and Pain Type
  // doc.fontSize(10).text(`Pain Level: ${data.pain_level}/10`, 385, 312);
  // doc.image(painLevelImagePath, 385, 330, { width: 135 });
  //Pain level Pediac
  doc.fontSize(10).text(`Pain Level: ${data.pain_level}/10`, 200, 248);
  doc.image(painLevelImagePath, 200, 267, { width: 135 });

//   doc.fontSize(10).text('Neurological Symptoms', 388, 246);
// const painTypeText = data.neurological_symptoms.join(', '); // Join the pain_type values with a comma
// doc.fontSize(8 * scaleFactor).text(painTypeText, 388, 265, { width: 170 }); // Render the joined string on one line

 // Horizontal line Section 2
 doc.moveTo(7, 300).lineTo(587, 300).stroke();  


   // Physical Assessment Findings
   doc.fontSize(10).text('Physical Assessment Findings', 15, 318);

   // Collect physical findings dynamically from the new fields
   const physicalFindings = [
     `Posture: ${data.posture}`,
     `Tone: ${data.tone}`,
     `Strength: ${data.strength}`,
     `ROM(Active): ${data.range_of_motion_active}`,
     `ROM(Passive): ${data.range_of_motion_passive}`,
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

   // Respiratory Assessment Findings
  //  doc.fontSize(10).text('Respiratory Findings', 15, 312);

  //  doc.fontSize(8).text('Breath Sounds:', 15, 334);
  //  doc.fontSize(8 * scaleFactor).text(data.breath_sounds, 77, 334, { width: 550 });
  //  doc.fontSize(8).text('Sputum Color:', 15, 352);
  //  doc.fontSize(8 * scaleFactor).text(data.sputum_color, 74, 32, { width: 550 });
  //  doc.fontSize(8).text('Cough:', 15, 370);
  //  doc.fontSize(8 * scaleFactor).text(data.cough, 46, 370, { width: 550 });
  //  doc.fontSize(8).text('Chest Expansion', 15, 388);
  //  doc.fontSize(8 * scaleFactor).text(data.chest_expansion, 80, 388, { width: 550 });

  // // Add Positive Special Tests
  // doc.fontSize(10).text('Positive Special Tests', 15, 450).fontSize(10);
  // doc.fontSize(8 * scaleFactor).text('McMurray test - Mild Pain', 15, 472, { width: 170 });// Add dynamically if available
  // // Add Neurological Symptoms
  // doc.fontSize(10).text('Neurological Symptoms', 388, 450);
  // doc.fontSize(8 * scaleFactor).text('None', 388, 472, { width: 170 });// Add dynamically if available

  // doc.fontSize(10).text('Gait Assessment', 15, 413).fontSize(10);
  // const gaitAssessment = data.gait_assessment.join(', '); // Join the pain_type values with a comma
  // doc.fontSize(8 * scaleFactor).text(gaitAssessment, 15, 435, { width: 170 }); // Render the joined string on one line
   //Functional limitaiton Cardo
  // doc.fontSize(10).text('Functional Limitations', 200, 312).fontSize(10);
  // const functionalLimitations = data.functional_limitations.join(', '); // Join the pain_type values with a comma
  // doc.fontSize(8 * scaleFactor).text(functionalLimitations, 200, 332, { width: 170 }); // Render the joined string on one line
//Functional limitaiton pediac
  doc.fontSize(10).text('Functional Limitations', 15, 406).fontSize(10);
  const functionalLimitations = data.functional_limitations.join(', '); // Join the pain_type values with a comma
  doc.fontSize(8 * scaleFactor).text(functionalLimitations, 15, 427, { width: 170 }); // Render the joined string on one line
 // Functional Limitations
// doc.fontSize(10).text('Functional Limitations', 202, 450);
// const funlimTypeText = data.functional_limitations.join(', ');
// doc.fontSize(8 * scaleFactor).text(funlimTypeText, 202, 472, { width: 170 });



 // Horizontal line Section 3
 doc.moveTo(7, 462).lineTo(587, 462).stroke();  

  // Treatment Duration
  doc.fontSize(10).text('Treatment Duration', 15, 480);
  doc.fontSize(8 * scaleFactor).text('6 weeks|2 to 3 sessions per week.', 15, 498, { width: 170 });

  // Modalities
  doc.fontSize(10).text('Modalities', 202, 480);
  doc.fontSize(8 * scaleFactor).text(data.modalities_used, 202, 498, { width: 170 });

  // Additional Assistive Aids
  doc.fontSize(10).text('Additional Assistive Aids', 388, 480);
  const additonalAssitive = data.assistive_aids.join(', ');
  doc.fontSize(8 * scaleFactor).text(additonalAssitive, 388, 498, { width: 170 });

  //Treatment Plan
  doc.fontSize(10).text('Treatment Plan', 15, 526);
  doc.fontSize(8 * scaleFactor).text(data.treatment_plan, 15, 545, { width: 550 });

  // Horizontal line Section 3
  doc.moveTo(7, 590).lineTo(587, 590).stroke(); 

  // Additional Notes
  doc.fontSize(10).text('Additional Notes', 15, 606);
  doc.fontSize(8 * scaleFactor).text(data.additional_notes, 15, 624, { width: 550 });

  // Doctor's Prescription
  doc.fontSize(10).text(`Doctor's Prescription`, 15, 664);
  doc.fontSize(8 * scaleFactor).text(data.doctor_prescription, 15, 682, { width: 550 });

   // Previously Physiotherapy Taken
   doc.fontSize(10).text(`Previously Physiotherapy Taken`, 15, 722);
   doc.fontSize(8 * scaleFactor).text(data.previous_physiotherapy, 15, 739, { width: 550 });
  

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
