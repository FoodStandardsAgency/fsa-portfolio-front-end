# Project Field Definitions

---

## Project IDs

### `Project ID`
This is the project identifier and is the unique key for a project.
It is created automatically by the system when a new project is requested.
The format is: `{portfolio abbreviation}{yy}{mm}{3 digit index}`, for example: `ODD2007010`.

> **Notes:**
> - can't be excluded in the portfolio configuration and is always included in project views
> - can't be set to *Admin only*

### `Business Case Number`
Text describing the *Business Case Number* for the project.

### `FS Number`
Text describing the *FS Number* for the project.


---

## About the project

### Project title
The concise name of the project, limited to a maximum of 250 characters.

> **Notes:**
> - required: projects must have a value set
> - can't be excluded in the portfolio configuration and is always included in project views

### `Short description`
Text describing the *Short description* for the project.

### `Risk rating`
The selected *Risk rating*, from a list of options configured independently for each portfolio.

### `Theme`
The selected *Theme*, from a list of options configured independently for each portfolio.

### `Project type`
The selected *Project type*, from a list of options configured independently for each portfolio.

### `Project size`
The selected *Project size*, from a list of options configured independently for each portfolio.

### `Category`
The selected Category, from a list of categories. These are configured independently for each portfolio.

### `Secondary category`
The selected Sub-categories, multiple values can be selected from the list of configured categories.

> **Notes:**
> - is dependent on `Category` and can only be included in project views if `Category` is included

### `Directorate`
The selected *Directorate*, from a predefined list of options.

### `Strategic objectives`
The selected *Strategic objectives*, from a predefined list of options.

### `Programme`
The selected *Programme*, from a list of options configured independently for each portfolio.

### `Programme description`
Text describing the *Programme description* for the project.

> **Notes:**
> - is dependent on `Programme` and can only be included in project views if `Programme` is included

### `Project channel (link)`
A descriptive name, and a link URL describing the *Project channel (link)* for the project.

### `Related projects`
Multiple *Related projects* entries selected from a searchable list of values.

### `Dependencies`
Multiple *Dependencies* entries selected from a searchable list of values.

### `Key documents`
The *Key documents* for the project as a list of items, each with a descriptive name and link URL.


---

## Project team

### `Project lead`
The *Project lead* selected from a searchable list of values.

### `Lead role`
The selected *Lead role*, from a list of options configured independently for each portfolio.

> **Notes:**
> - is dependent on `Project lead` and can only be included in project views if `Project lead` is included

### `Lead team`
The *Lead team* for the project. This is read only and the value is automatically generated.

> **Notes:**
> - is dependent on `Project lead` and can only be included in project views if `Project lead` is included

### `Key contact 1`
The *Key contact 1* selected from a searchable list of values.

### `Key contact 2`
The *Key contact 2* selected from a searchable list of values.

### `Key contact 3`
The *Key contact 3* selected from a searchable list of values.

### `Supplier`
Text describing the *Supplier* for the project.

### `Project team`
Multiple *Project team* entries, selected from a searchable list of values.

### `Project team setting 1`
Text describing the *Project team setting 1* for the project.

### `Project team setting 2`
Text describing the *Project team setting 2* for the project.

### `Project team option 1`
The selected *Project team option 1*, from a list of options configured independently for each portfolio.

### `Project team option 2`
The selected *Project team option 2*, from a list of options configured independently for each portfolio.


---

## Project plan

### `Intended start date`
The *Intended start date* for the project, which can be entered to the day, month or just the year.

### `Actual start date`
The *Actual start date* for the project, which can be entered to the day, month or just the year.

### `Expected current phase end date`
The *Expected current phase end date* for the project, which can be entered to the day, month or just the year.

> **Notes:**
> - has changes explicitly tracked

### `Expected end date`
The *Expected end date* for the project, which can be entered to the day, month or just the year.

### `Actual end date`
The *Actual end date* for the project, which can be entered to the day, month or just the year.

### `Hard deadline`
The *Hard deadline* for the project, which can be entered to the day, month or just the year.

### `Percentage completed`
The *Percentage completed* for the project, as a percentage value between 0 and 100.

> **Notes:**
> - has changes explicitly tracked

### `Milestones`
The *Milestones* for the project, as an ordered list of milestones with dates.

### `Project plan setting 1`
Text describing the *Project plan setting 1* for the project.

### `Project plan setting 2`
Text describing the *Project plan setting 2* for the project.

### `Project plan option 1`
The selected *Project plan option 1*, from a list of options configured independently for each portfolio.

### `Project plan option 2`
The selected *Project plan option 2*, from a list of options configured independently for each portfolio.


---

## Progress indicators

### `Phase`
This is the current *phase* for the project.
A project moves through phases as it progresses from inception to completion. Phases are configured in the portfolio configuration:
- The minimum number of phases is 2
- The maximum number of phases is 6
- The last configured phase is the *completed* phase:
    - it is not shown in portfolio summaries
- The last but one phase is the *archive* phase:
    - this phase is the last phase shown in project summaries
    - projects remain in this phase for 90 days
    - after 90 days projects are automatically moved to the *completed* phase
- If the portfolio phases are reconfigured:
    - historic phases are not preserved
    - projects in the *nth phase* will remain in the *nth phase* after configuration
    - portfolio configuration shows an error if it would remove a phase that contains projects

> **Notes:**
> - has changes explicitly tracked
> - can't be excluded in the portfolio configuration and is always included in project views

### `RAG`
The selected RAG status. Depending on the configuration, the value is chosen from either:
- Red/Amber/Green (3 status options) or
- Red/Red Amber/Amber/Amber Green/Green (5 status options)

> **Notes:**
> - has changes explicitly tracked

### `How to get to green`
Text describing the *How to get to green* for the project.

> **Notes:**
> - is dependent on `RAG` and can only be included in project views if `RAG` is included

### `Status`
The selected *Status*, from a list of options configured independently for each portfolio.

> **Notes:**
> - has changes explicitly tracked

### `Progress indicators setting 1`
Text describing the *Progress indicators setting 1* for the project.

### `Progress indicators setting 2`
Text describing the *Progress indicators setting 2* for the project.

### `Progress indicators option 1`
The selected *Progress indicators option 1*, from a list of options configured independently for each portfolio.

### `Progress indicators option 2`
The selected *Progress indicators option 2*, from a list of options configured independently for each portfolio.


---

## Updates

### `Update`
The *Update* for the project. These are a series of date ordered updates. The update text can only be changed on the same day it is entered.

> **Notes:**
> - has changes explicitly tracked

### `Forward look`
Text describing the *Forward look* for the project.

### `Emerging issues, risks`
Text describing the *Emerging issues, risks* for the project.


---

## Prioritisation

### `Priority score`
The selected *Priority score*, from a predefined list of options.

### `Priority group`
The *Priority group* for the project. This is read only and the value is automatically generated.

### `Funded`
The selected *Funded*, from a predefined list of options.

### `Confidence in delivery`
The selected *Confidence in delivery*, from a predefined list of options.

### `Priorities impacted`
The selected *Priorities impacted*, from a predefined list of options.

### `Benefits`
The selected *Benefits*, from a predefined list of options.

### `Criticality`
The selected *Criticality*, from a predefined list of options.


---

## Budget

### `Budget category`
The selected *Budget category*, from a list of options configured independently for each portfolio.

> **Notes:**
> - is only visible to FSA employees

### `Budget amount`
The *Budget amount* for the project in GBP.

> **Notes:**
> - has changes explicitly tracked
> - is only visible to FSA employees

### `Amount spent`
The *Amount spent* for the project in GBP.

> **Notes:**
> - has changes explicitly tracked
> - is only visible to FSA employees

### `Forecast spend at completion`
The *Forecast spend at completion* for the project in GBP.

> **Notes:**
> - is only visible to FSA employees

### `Cost centre`
Text describing the *Cost centre* for the project.

> **Notes:**
> - is only visible to FSA employees

### `Budget field 1`
The *Budget field 1* for the project in GBP.

> **Notes:**
> - is only visible to FSA employees

### `Budget field 2`
The *Budget field 2* for the project in GBP.

> **Notes:**
> - is only visible to FSA employees

### `Budget option 1`
The selected *Budget option 1*, from a list of options configured independently for each portfolio.

> **Notes:**
> - is only visible to FSA employees

### `Budget option 2`
The selected *Budget option 2*, from a list of options configured independently for each portfolio.

### `Future Forecast`
Repeating field to provide a list of budget forecasts for future years.

> **Notes:**
> - is only visible to FSA employees


---

## FSA Processes

### `Assurance gate number`
Text describing the *Assurance gate number* for the project.

### `Assurance gate completed`
The *Assurance gate completed* for the project, which can be entered to the day, month or just the year.

### `Next gate`
Text describing the *Next gate* for the project.

### `FSA Processes setting 1`
Text describing the *FSA Processes setting 1* for the project.

### `FSA Processes setting 2`
Text describing the *FSA Processes setting 2* for the project.

### `FSA Processes option 1`
The selected *FSA Processes option 1*, from a list of options configured independently for each portfolio.

### `FSA Processes option 2`
The selected *FSA Processes option 2*, from a list of options configured independently for each portfolio.

