from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_path = "c:\\moss-hack\\Mantis\\mitsubishi_manual.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        spaceAfter=20
    )
    heading_style = ParagraphStyle(
        'PageHeading',
        parent=styles['Heading2'],
        fontSize=16,
        leading=20,
        spaceAfter=15
    )
    body_style = ParagraphStyle(
        'ManualBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        spaceAfter=10
    )
    
    story = []
    
    # Page 1
    story.append(Paragraph("MITSUBISHI HEAVY INDUSTRIES, LTD.", title_style))
    story.append(Paragraph("USER'S MANUAL AIR-CONDITIONER", title_style))
    story.append(Paragraph("Models:<br/>SRK25ZMP-S<br/>SRK35ZMP-S<br/>SRK45ZMP-S", body_style))
    story.append(PageBreak())
    
    # Page 2
    story.append(Paragraph("Contents", heading_style))
    story.append(Paragraph("Safety precautions ........................................ 2<br/>Name of each part and its function ............... 6<br/>Remote control handling ............................... 8<br/>Operation failure with the remote control ...... 8<br/>Temporary run operation .............................. 8<br/>Operation and display section for remote control ... 9<br/>Current time setting....................................... 9<br/>AUTO mode operation ................................ 10<br/>Temperature adjustment during AUTO....... 10<br/>FAN SPEED................................................ 10<br/>COOL/HEAT/DRY/FAN mode operation .... 11<br/>Air-conditioner operable temperature setting ... 11<br/>Characteristics of HEAT mode operation ... 11<br/>Airflow direction adjustment ........................ 12<br/>SLEEP TIMER operation ............................ 13<br/>OFF-TIMER operation ................................ 13<br/>ON-TIMER operation .................................. 14<br/>SLEEP TIMER + ON-TIMER operation ...... 14<br/>PROGRAM TIMER operation ..................... 15<br/>HIGH POWER/ECONOMY operation......... 16<br/>SELF CLEAN operation .............................. 17<br/>Auto restart function .................................... 17<br/>Tips for effective operation ......................... 17<br/>Maintenance ............................................... 18<br/>Proper installation ....................................... 19<br/>Troubleshooting .......................................... 20<br/>Notice .......................................................... 20<br/>Contact your dealer..................................... 21<br/>Self diagnosis function ................................ 22", body_style))
    story.append(PageBreak())
    
    # Page 3
    story.append(Paragraph("Safety Precautions - Installation Precautions", heading_style))
    story.append(Paragraph("WARNING: The system is for domestic, residential etc. use. If used in severer environments, such as an engineering workplace, the equipment may function poorly. The system must be installed by your dealer or a qualified professional. It is not advisable to install the system by yourself, as faulty handling may cause leakage of water, electric shock or fire.", body_style))
    story.append(Paragraph("CAUTION: Do not install it where flammable gas may leak. Gas leaks may cause fire. Depending on the place of installation, an earth leakage breaker may be necessary. If you do not install an earth leakage breaker, you may get an electric shock. Make sure to install the drain hose properly so that all the water is drained out. Improper installation may lead to water drop in the room resulting in wet furniture. Make sure that the system has been properly earthed. Earth cables should never be connected to a gas pipe, water pipe, lightning conductor or telephone earth cable. Incorrect installation of the earth cable may produce an electric shock.", body_style))
    story.append(PageBreak())
    
    # Page 4
    story.append(Paragraph("Safety Precautions - Operation Precautions", heading_style))
    story.append(Paragraph("WARNING: Children shall not play with the appliance. Do not expose yourself to the cooling air for a long period. This could affect your physical condition and cause health problems. Cleaning and user maintenance shall not be made by children without supervision. Do not insert anything into the air inlet. This may cause injury, as the internal fan rotates at high speed.", body_style))
    story.append(Paragraph("CAUTION: Only use approved fuses. Use of steel or copper wire instead of an approved fuse is strictly prohibited, as it may cause a breakdown or fire. Do not handle the switches with wet hands. This may cause an electric shock. Do not swing from the indoor unit. If the indoor unit falls down, you may get injured. Do not place a flammable insecticide or paint spray near the blower, nor spray it directly on the system. This may result in a fire. You should not expose any combustion appliance directly to the air stream of the air-conditioner. The appliance may then work inadequately. Do not wash the air-conditioner with water. This could cause an electric shock.", body_style))
    story.append(PageBreak())

    # Page 5
    story.append(Paragraph("Safety Precautions - Operation Precautions (Continued)", heading_style))
    story.append(Paragraph("CAUTION: Do not touch the aluminum fins on the air heat exchanger. It may result in injury. Do not place household electrical appliances or household items underneath the indoor or outdoor units. Condensation falling from the unit may stain objects and cause accidents or electrical shock. Do not operate the system without the air filter. It can cause malfunction of the system due to clogging of the heat exchanger. Do not shut off the power supply immediately after stopping the operation. Wait at least 5 minutes, otherwise there is a risk of water leakage or breakdown. Do not control the system with main power switch. It can cause fire or water leakage. In addition, the fan can start unexpectedly, which can cause personal injury. Do not pour liquid into this unit and do not put water container on this unit. Water entering the unit could damage the insulation and therefore cause an electric shock.", body_style))
    story.append(Paragraph("Contact your dealer to clean inside the indoor unit, do not attempt to do by yourself. The use of a non-approved detergent or improper washing method may damage the unit's plastic components and cause leaks. Damage, smoke, or fire may also happen if the detergent comes in contact with electrical parts or the unit's motor. Stop the unit and turn off the power if you hear thunder or there is a danger of lightning. It may damage the unit. Do not let the foreign matters enter the indoor unit through the air outlets. This may cause the dumper inoperable. If the power cord becomes damaged, contact your dealer or a qualified engineer. If it is not replaced, it may cause a breakdown or fire.", body_style))
    story.append(PageBreak())

    # Page 12
    story.append(Paragraph("COOL/HEAT/DRY/FAN Mode Operation & Temperature Settings", heading_style))
    story.append(Paragraph("Press the MODE select button. Move the [mark] to the required operation position: Cool, Heat, Dry, Fan. Press the ON/OFF button to start.", body_style))
    story.append(Paragraph("Recommended Temperature Settings:<br/>Cool: 26°C - 28°C<br/>Heat: 22°C - 24°C<br/>Dry: 24°C - 26°C", body_style))
    story.append(Paragraph("Air-conditioner Operable Temperature Range:<br/>Cooling operation: Outside temperature approximately -15°C to 46°C, Inside temperature approximately 18°C to 32°C.<br/>Heating operation: Outside temperature approximately -15°C to 24°C, Inside temperature approximately 15°C to 30°C.", body_style))
    story.append(Paragraph("Defrosting: If the outdoor temperature is low and humidity is high, the heat exchanger in the outdoor unit may frost over, which prevents efficient heating. The automatic defrost function is activated, and during defrosting the heating operation stops for 5 to 15 minutes. Both indoor and outdoor fans stop and the RUN light blinks slowly (1.5 sec ON, 0.5 sec OFF).", body_style))
    story.append(PageBreak())

    # Page 18
    story.append(Paragraph("SELF CLEAN Operation & Auto Restart", heading_style))
    story.append(Paragraph("SELF CLEAN Operation: In order to active CLEAN operation, press the CLEAN switch with the tip of a ballpoint pen. Every time the CLEAN switch is pressed, the display is switched. CLEAN operation should be run after AUTO, COOL and DRY operation to remove the moisture from inside the indoor unit and control the growth of mold and bacteria. Two hours later, the air conditioner stops running automatically. The indoor unit fan runs for about two hours in CLEAN operation. The RUN light illuminates during CLEAN operation.", body_style))
    story.append(Paragraph("Auto restart function records the operational status of the air-conditioner immediately prior to be switched off by a power cut, and then automatically resumes operations after the power has been restored.", body_style))
    story.append(PageBreak())

    # Page 23
    story.append(Paragraph("Self Diagnosis Function & Error Codes", heading_style))
    story.append(Paragraph("Self Diagnosis Function: We are constantly trying to do better service to our customers by installing such judges that show abnormality of each function as follows:", body_style))
    story.append(Paragraph("<b>TIMER light ON:</b><br/>"
                           "• 1-time flash: Heat exchanger sensor error (Cause: Broken heat exchanger sensor wire, poor connector connection)<br/>"
                           "• 2-time flash: Room temperature sensor error (Cause: Broken room temperature sensor wire, poor connector connection)<br/>"
                           "• 5-time flash: Active filter voltage error (Cause: Defective power supply)<br/>"
                           "• 6-time flash: Indoor fan motor error (Cause: Defective fan motor, poor connector connection)", body_style))
    story.append(Paragraph("<b>RUN light keeps flashing:</b><br/>"
                           "• 1-time flash: Outdoor temperature sensor error (Cause: Broken outdoor sensor wire, poor connector connection)<br/>"
                           "• 2-time flash: Outdoor heat exchanger fluid pipe sensor error (Cause: Broken heat exchanger fluid pipe sensor wire, poor connector connection)<br/>"
                           "• 4-time flash: Discharge pipe sensor error (Cause: Broken discharge pipe sensor wire, poor connector connection)", body_style))
    story.append(Paragraph("<b>RUN light ON:</b><br/>"
                           "• 1-time flash: Current cut (Cause: Compressor locking, open phase on compressor output, shortcircuit on power transistor, closed service valve)<br/>"
                           "• 2-time flash: Trouble of outdoor unit (Cause: Broken power transistor, broken compressor wire, broken discharge pipe sensor wire, poor connector connection, compressor blockage)<br/>"
                           "• 3-time flash: Over current (Cause: Overload operation, overcharge)<br/>"
                           "• 4-time flash: Power transistor error (Cause: Broken power transistor)<br/>"
                           "• 5-time flash: Over heat of compressor (Cause: Gas shortage, defective discharge pipe sensor, closed service valve)<br/>"
                           "• 6-time flash: Error of signal transmission (Cause: Defective power supply, Broken signal wire, defective in/outdoor unit boards)<br/>"
                           "• 7-time flash: Outdoor fan motor error (Cause: Defective fan motor, poor connector connection)", body_style))
    
    doc.build(story)
    print("PDF generated successfully.")

if __name__ == "__main__":
    generate_pdf()
