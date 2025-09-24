import json
import docxpy
import fitz
import google.generativeai as genai
import os
import requests
import sys

api_key = 'AIzaSyC5eiiEPoczJrSU7r9vYTpg7zYRuletAgg'

def extract_text_from_docx(file_path):
    text = docxpy.process(file_path)
    return text

def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_text(file_path):
    if file_path.endswith('.docx'):
        return extract_text_from_docx(file_path)
    elif file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    else:
        return "Unsupported File Format"
    
def generate_response(text):
    # Configure the API key
    genai.configure(api_key=api_key)
    # Load the Gemini model
    model = genai.GenerativeModel('gemini-pro')
    resumeSchema = '''
        const workExperienceSchema = mongoose.Schema({
        title: { type: String },
        employer: { type: String },
        city: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        desc: { type: String },
        current: { type: Boolean },
        name: { type: String },
      });
      const referencesSchema = {
        fullname: { type: String },
        company: { type: String },
        phone: { type: String },
        email: { type: String },
        name: { type: String },
      };
      const investmentsSchema = {
        course: { type: String },
        institution: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        name: { type: String },
        desc: { type: String },
      };
      const achievementsSchema = {
        title: { type: String },
        desc: { type: String },
      };
      const gapsSchema = {
        activity: { type: String },
        city: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        name: { type: String },
        desc: { type: String },
      };
      const untitledSchema = {
        activity: { type: String },
        city: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        name: { type: String },
        desc: { type: String },
      };
      const activitySchema = {
        activity: { type: String },
        city: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        name: { type: String },
        desc: { type: String },
      };

      const internshipSchema = {
        activity: { type: String },
        city: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        name: { type: String },
        desc: { type: String },
      };

      const imageSchema = {
        url: { type: String },
        public_id: { type: String },
      };

      const degreesSchema = {
        institution: { type: String },
        city: { type: String },
        degree: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        desc: { type: String },
        name: { type: String },
      };

      const resumeSchema = mongoose.Schema(
        {
          name: { type: String },
          firstname: { type: String },
          surname: { type: String },
          jobTitle: { type: String },
          city: { type: String },
          country: { type: String },
          postalcode: { type: String },
          address: { type: String },
          phone: { type: String },
          linkedIn: { type: String },
          twitter: { type: String },
          portfolio: { type: String },
          email: { type: String },
          license: { type: String },
          sc: { type: String },
          secondaryColor: { type: String, default: "#000000" },
          sponsorship: { type: String },
          workExperiences: { title: String, values: [workExperienceSchema] },
          references: { show: Boolean, title: String, ref: String, deleted: Boolean },
          degrees: { title: String, values: [degreesSchema] },
          languages: { title: String, values: [String], deleted: Boolean },
          careerInvestments: { title: String, values: [investmentsSchema], deleted: Boolean },
          careerAchievements: { title: String, values: [achievementsSchema], deleted: Boolean },
          gaps: { title: String, values: [gapsSchema], deleted: Boolean },
          untitled: { title: String, values: [untitledSchema], deleted: Boolean },
          activity: { title: String, values: [activitySchema], deleted: Boolean },
          skills: { type: [String] },
          summary: { type: String },
          hobbies: { title: String, value: String },
          software: { type: [String] },
          template: { type: Number },
          );
    '''

    # 5. Degrees property doesn't need the show and deleted properties
    example_output = '''
    { "name": null, "firstname": "FOSTER", "surname": "ASARE", "jobTitle": "Fullstack Website Developer", "city": null, "country": "South Africa", "postalcode": null, "address": null, "phone": "+233550529015", "linkedIn": "https://www.linkedin.com/in/foster-asare-599660232", "twitter": "twitter.com/@fostersoasare", "portfolio": null, "email": "fostersoasare@gmail.com", "license": "", "sc": "", "secondaryColor": "#000000", "sponsorship": "", "workExperiences": { "title": "Work Experiences", "values": [ { "title": "Lead Website Developer", "employer": "Zest", "city": null, "startDate": "08/2023", "endDate": null, "desc": "Translation of design concepts into functional and visually appealing user interfaces. Creating layouts, implement styling, and handling user interactions.\nFocused on the overall performance of the app by considering accessibility , SEO and performance with a main focus on load timesBuilt and delivered technical solutions according to stakeholder business requirements", "current": true, "name": null }, { "title": "Frontend Website Developer", "employer": "WalletHack", "city": null, "startDate": "11/2022", "endDate": "03/2023", "desc": "Working with a team of back end and front end developers to create high performing single page applications to be used for various SaaS ideasActively participating in code reviews and collaborated with the team to maintain coding standards and best practices.\nDeveloped, maintained, and shipped production code for client websites primarily using React and CSS\nIntegrated RESTful APIs and backend services to enable seamless data exchange and real-\ntime updates in web applications.", "current": false, "name": "" }, { "title": "Frontend Website Developer", "employer": "Cedirates", "city": null, "startDate": "02/2022", "endDate": "05/2023", "desc": "Delivering high-quality, robust production code for a diverse array of projects including procvcreator and xennolEnsuring consistent performance across various platforms and browsers by rigorously testing and debugging websites and applications for cross-browser compatibility.\nCollaborating closely with clients who take the lead in research, controlled development, and architectural decisions for technical solutions, ensuring they align with project requirements.\nI consistently keep myself abreast of the latest web technologies, frameworks, and best practices, enabling me to deliver cutting-edge solutions and maintain a position at the forefront of industry trends.", "current": false, "name": "" }, { "title": "MERN Website Developer", "employer": "Xennol Limited", "city": "", "startDate": "05/2022", "endDate": null, "desc": "Experienced Software Developer proficient in coding and debugging, consistently delivering project objectives through the creation of refined, scalable, and production-ready code. Adept at collaborating within Agile and Scrum frameworks to achieve team goals effectively.", "current": true, "name": "" } ] }, "references": { "show": true, "title": "References", "ref": null, "deleted": false }, "degrees": { "title": "Degrees", "values": [], "deleted": false }, "languages": { "title": "Languages", "values": [ "English" ], "deleted": false }, "careerInvestments": { "title": "Career Investments", "values": [], "deleted": false }, "careerAchievements": { "title": "Career Achievements", "values": [], "deleted": false }, "gaps": { "title": "Gaps", "values": [], "deleted": false }, "untitled": { "title": "Untitled", "values": [], "deleted": false }, "activity": { "title": "Activity", "values": [], "deleted": false }, "skills": [ "HTML", "CSS", "Javascript", "PHP", "MYSQL", "MongoDB" ], "summary": "Innovative and results-driven Full Stack Developer with 5+ years of experience in designing and developing robust web and mobile applications. Proficient in front-end and back-end technologies, including React, Node.js, and Django. Experienced in mobile app development with React Native and Flutter. Skilled in leveraging modern technologies to deliver high-quality software solutions that enhance user experience and drive business success.", "hobbies": "Music , dance , reading books about self-improvement and personality , coding amazing stuff", "software": [ "Typescript", "NodeJs", "Express", "React", "Scss", "Tailwindcss", "React Redux" ], "template": 1 }
    '''

    cautions = '''
    2. Name is not fullname but something else so set it to null
    3. As such populate the surname and firstname accordingly
    4. Make sure all properties in the 'resumeSchema' with a 'title' credential have a default value that matches the property name. For Example: 'workExperiences' should have a 'title' of 'Work Experiences' , 'gaps' should have 'title' of 'Gaps', in that format.
    6. The template property is a number, set it to 1 not null
    '''
    prompt = f"Extract the credentials from the given resume text strictly according to resumeSchema given as follows: {resumeSchema}. Do not leave behind '''json string: {text}. Set 'deleted' to false where ever found in the resumeSchema. Be dead sure that your response complies and can work 100% according to given resumeSchema and the following precautions: {cautions}. Please write null where the credential is not provided. Strictly set all 'show' values to true where ever 'show' is present in the resumeSchema. If you do not find month and year for 'startDate' and 'endDate' then make write it as its value null. Formats for all 'startDate' and 'endDate' everywhere must be MM/YYYY, For example 08/2018, in that format. Here is an example structure of response (where null is written if information is not available in text) you must output in accordance with structure: {example_output}"
    response = model.generate_content(prompt)
    return response.text

def resume_parser(file_url):
        response = requests.get(file_url)
        # Create uploads directory if it doesn't exist
        if not os.path.exists('uploads'):
          os.makedirs('uploads')
        
        # Get the file name from the URL
        file_name = file_url.split('/')[-1]
        file_path = 'uploads/' + file_name 
        
        # Save the downloaded file to the uploads directory
        with open(file_path, 'wb') as f:
            f.write(response.content)

        extracted_text = extract_text(file_path)
        generated_response = generate_response(extracted_text)
        # Replace all occurrences of "null" with empty string
        modified_text = generated_response.replace("null", '""')
        import re
        from datetime import datetime

        def parse_dates(text):
            def replace_date(match):
                date_string = match.group(0)
                date_string = date_string.replace(',', '')  # Remove any commas
                formats = ['%b %d %Y', '%B %d %Y', '%b  %Y', '%B %Y', '%b %y', '%B %y', '%B %d %Y']
                for fmt in formats:
                    try:
                        date_obj = datetime.strptime(date_string, fmt)
                        return date_obj.strftime('%m/%Y')
                    except ValueError:
                        pass
                
                # If date format is not recognized, try converting using convert_to_mm_yyyy
                date_string = convert_to_mm_yyyy(date_string)
                return date_string

            # Define regex pattern to match dates
            date_pattern = r'\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC), (\d{4})\b'

            # Replace dates in the text using the replace_date function
            modified_text = re.sub(date_pattern, replace_date, text)

            return modified_text

        def convert_to_mm_yyyy(text):
            def replace_date(match):
                date_string = match.group(0)
                date_string = date_string.replace(',', '')  # Remove any commas
                formats = ['%b %d %Y', '%B %d %Y', '%b  %Y', '%B %Y', '%b %y', '%B %y', '%B %d %Y']
                for fmt in formats:
                    try:
                        date_obj = datetime.strptime(date_string, fmt)
                        return date_obj.strftime('%m/%Y')
                    except ValueError:
                        pass
                return ""

            # Define regex pattern to match dates
            date_pattern = r'(?:\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b(?:\s+|[\.,]\s*)(?:\d{1,2}(?:st|nd|rd|th)?[\.,]?\s+)?\d{2,4})'

            # Replace dates in the text using the replace_date function
            modified_text = re.sub(date_pattern, replace_date, text)

            return modified_text

        # Test cases
        # text = '{ "name": "", "firstname": "FOSTER", "surname": "ASARE", "jobTitle": "Fullstack Website Developer", "city": "", "country": "", "postalcode": "", "address": "", "phone": "+233550529015", "linkedIn": "https://www.linkedin.com/in/foster-asare-599660232", "twitter": "twitter.com/@fostersoasare", "portfolio": "", "email": "fostersoasare@gmail.com", "license": "", "sc": "", "secondaryColor": "#000000", "sponsorship": "", "workExperiences": { "title": "Work Experiences", "values": [ { "title": "Lead Website Developer", "employer": "Zest", "city": "", "startDate": "Aug 23", "endDate": "", "desc": "Translation of design concepts into functional and visually appealing user interfaces. Creating layouts, implement styling, and handling user interactions.\nFocused on the overall performance of the app by considering accessibility , SEO and performance with a main focus on load timesBuilt and delivered technical solutions according to stakeholder business requirements", "current": true, "name": "" }, { "title": "Frontend Website Developer", "employer": "WalletHack", "city": "", "startDate": "11/2022", "endDate": "MAR , 2023", "desc": "Working with a team of back end and front end developers to create high performing single page applications to be used for various SaaS ideasActively participating in code reviews and collaborated with the team to maintain coding standards and best practices.\nDeveloped, maintained, and shipped production code for client websites primarily using React and CSS\nIntegrated RESTful APIs and backend services to enable seamless data exchange and real-\ntime updates in web applications.", "current": false, "name": "" }, { "title": "Frontend Website Developer", "employer": "Cedirates", "city": "", "startDate": "FEB, 2022", "endDate": "MAY, 2023", "desc": "Delivering high-quality, robust production code for a diverse array of projects including procvcreator and xennolEnsuring consistent performance across various platforms and browsers by rigorously testing and debugging websites and applications for cross-browser compatibility.\nCollaborating closely with clients who take the lead in research, controlled development, and architectural decisions for technical solutions, ensuring they align with project requirements.\nI consistently keep myself abreast of the latest web technologies, frameworks, and best practices, enabling me to deliver cutting-edge solutions and maintain a position at the forefront of industry trends.", "current": false, "name": "" }, { "title": "MERN Website Developer", "employer": "Xennol Limited", "city": "", "startDate": "05/2022", "endDate": "", "desc": "Experienced Software Developer proficient in coding and debugging, consistently delivering project objectives through the creation of refined, scalable, and production-ready code. Adept at collaborating within Agile and Scrum frameworks to achieve team goals effectively.", "current": true, "name": "" } ] }, "references": { "show": true, "title": "References", "ref": "", "deleted": false }, "degrees": { "title": "Degrees", "values": [], "deleted": false }, "languages": { "title": "Languages", "values": [ "English" ], "deleted": false }, "careerInvestments": { "title": "Career Investments", "values": [], "deleted": false }, "careerAchievements": { "title": "Career Achievements", "values": [], "deleted": false }, "gaps": { "title": "Gaps", "values": [], "deleted": false }, "untitled": { "title": "Untitled", "values": [], "deleted": false }, "activity": { "title": "Activity", "values": [], "deleted": false }, "skills": [ "HTML", "CSS", "Javascript", "PHP", "MYSQL", "MongoDB" ], "summary": "", "hobbies": "Music , dance , reading books about self-improvement and personality , coding amazing stuff", "software": [ "Typescript", "NodeJs", "Express", "React", "Scss", "Tailwindcss", "React Redux" ], "template": 1 }'
        text_one = parse_dates(modified_text)
        final_text = convert_to_mm_yyyy(text_one)
        os.remove(file_path)
        return json.loads(json.dumps(final_text))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(resume_parser(sys.argv[1]))
    else:
        print("Please provide the file URL as a command-line argument.")
