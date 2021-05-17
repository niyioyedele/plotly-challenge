function buildMetadata(sample) {
    
    d3.json(samples.json).then((data) => {
// get metadata info for demographic panel
      var metadata = data.metadata

      console.log(metadata)
// filter metadata info by id
      var info = matadata.filter(info =>info.id.toString() === id )[0]
    
      var PANEL = d3.select("#sample-metadata") 
      // Filter the data for the object with the desired sample number
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(info).forEach(function ([key,value]){
      var row = PANEL.append("p");
      row.text(`${key}: ${value}`);
      });
  
      // BONUS: Build the Gauge Chart
    //   buildGauge(result.wfreq);
    });
  }
  
  function buildCharts(sample) {
    d3.json("samples.json").then((plotdata) => {
    //   var samples = data.samples;
    //   var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //   var result = resultArray[0];
  
    //   var otu_ids = result.otu_ids;
    //   var otu_labels = result.otu_labels;
    //   var sample_values = result.sample_values;

    
      var otu_ids = plotdata.otu_ids;
      var sample_values = plotdata.sample_values;
      var size = plotdata.sample_values;
      var color = plotdata.otu_ids;
      var labels = plotdata.otu_labels;
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Bacteria Cultures/Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var trace = [
        {
          x: otu_ids,
          y: sample_values,
          text: labels,
          mode: "markers",
          marker: {
            size: size,
            color: color,
            colorscale: "Rainbow"
          }
        }
      ];
  
      Plotly.newPlot("bubble", trace, bubbleLayout);
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var trace1 = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "10 most common Bacteria Cultures in sample",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", trace1, barLayout);
    });
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(id) {
    // Fetch new data each time a new sample is selected
    buildCharts(id);
    buildMetadata(id);
  }
  
  // Initialize the dashboard
  init();
  