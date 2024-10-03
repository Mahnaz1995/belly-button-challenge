function getSubjectData(allData, subjectID) {
  let subjectData = allData.filter(item => item.id == subjectID)[0];
  return subjectData;
}


// Build the metadata panel
function buildMetadata(subjectID) {
  console.log(`buildMetadata: ${subjectID}`);
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let allMetadata = data.metadata;    

    // Filter the metadata for the object with the desired sample number
    let subjectMetadata = getSubjectData(allMetadata, subjectID);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataDivTag = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadataDivTag.html("");

    let subjectMetadataEntries = Object.entries(subjectMetadata);
    subjectMetadataEntries.forEach(entry => {
      let fieldName = entry[0].toUpperCase();
      let value = entry[1];
      metadataDivTag.append("h6").text(`${fieldName}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(subjectID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // console.log(`buildCharts: ${subjectID}`);
    // Get the samples field
    let sample_values = data.samples; 

    // Filter the samples for the object with the desired sample number
    let samples = getSubjectData(sample_values, subjectID);
    //console.log(samples);
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samples.otu_ids;
    let otu_labels = samples.otu_labels;
    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: samples.sample_values,
      mode: 'markers',
      marker: {
       size: samples.sample_values,
       color: otu_ids,
       colorscale: 'Earth',
       text: otu_labels   
      }
    }];
    
    let bubblelayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: 'OTU ID',
      },
      yaxis: {
       title: 'Number f Bacteria', 
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble',bubbleData,bubblelayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      x: samples.sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: 'Number of Bacteria', 
      },
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar',barData,barLayout);
  });
}


// Function for event listener
function optionChanged(subjectID) {
  console.log(`optionChanged: ${subjectID}`);
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(subjectID);
  buildCharts(subjectID);
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // 1.populate the dropdown menue
    let allSubjectIDs = data.names;
    let selectTag = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    allSubjectIDs.forEach(id => {
      selectTag.append("option").attr("value", id).text(id);   
    });

    // 2.Build charts and metadata panel with the first subject
    let firstSubjectID =  allSubjectIDs[0];
    console.log(`init: ${firstSubjectID}`);
    optionChanged(firstSubjectID);
  });
}


// Initialize the dashboard
init();
