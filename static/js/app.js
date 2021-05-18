function buildMetadata(sample) {
    
    d3.json("samples.json").then((data) => {
// get metadata info for demographic panel
      var metadata = data.metadata

      // console.log(metadata)
// filter metadata info by id
      // 
      var info = metadata.filter(meta => meta.id == sample)[0];
      // var info = resultArray[0];
    
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
    d3.json("samples.json").then((data) => {
  // deining the parameters for the bubble and bar charts
      var samples = data.samples;
      var info = samples.filter(meta => meta.id == sample)[0];
      var otu_ids = info.otu_ids;
      var labels = info.otu_labels;
      var sample_values = info.sample_values;
      var size = info.sample_values;
      var color = info.otu_ids;         
      var bar_sample = sample_values.slice(0, 10).reverse();
      var bar_label = labels.slice(0, 10).reverse()
      

    
     
      var bubbleLayout = {
        title: "Bacteria Cultures/Sample",
        margin: { t: 0 },      
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
          x: bar_sample,
          text: bar_label,
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "Most common Bacteria Cultures in sample",
        margin: { t: 50, l: 100,r: 100,b: 50 }
        
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
    // Fetch new data each time a new id is selected
    buildCharts(id);
    buildMetadata(id);
  }
  
  // Initialize the dashboard
  init();
  