    // Define an array to store the loaded job listings
    var jobListings = [];

    // Function to load job listings from data.json
    function loadJobListings() {
      $.getJSON('data.json', function (data) {
        jobListings = data;
        displayJobListings(jobListings);
        populatePositionFilter(); // Populate the position filter dropdown
      });
    }

    // Function to display job listings in the container
    // Function to display job listings in the container
function displayJobListings(listings) {
  var container = $('.job-listings');
  container.empty(); // Clear previous listings

  listings.forEach(function (listing, index) {
    var jobListingHtml = `
    <div class="grid_container2 job-listing">
      <div class="job_img">
        <img src="${listing.logo}" alt="${listing.company}">
      </div>
      <div class="contents">
        <h5 style="margin-bottom:6px; color:rgb(87, 156, 155);">
          ${listing.company}
          ${listing.new ? '<span class="tag new" style="margin-left:6px; background-color:rgb(87, 156, 155); color:white; border-radius:8px; font-size:12px; font-display:center;">new!</span>' : ''} 
          ${listing.featured ? '<span class="tag featured" style="margin-left:6px; background-color:black; color:white; border-radius:8px;">Featured</span>' : ''}
        </h5>
        <h3 class="job-title" style="cursor: pointer; color:rgb(0, 0, 0);">${listing.position}</h3>
        <h6 style="margin-top:7px; color:rgb(179, 174, 175);">${listing.postedAt} · ${listing.contract} · ${listing.location}</h6>
      </div>
      <div class="links">
        ${listing.languages.map(language => `<button class="button_style" style="color:rgb(87, 156, 155);">${language}</button>`).join(' ')}
        ${listing.tools.map(tool => `<button class="button_style" style="color:rgb(87, 156, 155);">${tool}</button>`).join(' ')}
      </div>
    </div>
  `;

    container.append(jobListingHtml);
  });

  // Add click event for showing job details when clicking on job title
  $('.job-title').click(function () {
    var index = $(this).closest('.grid_container2').index();
    if (!$(this).closest('.grid_container2').hasClass('open')) {
      // Close other open job details
      $('.grid_container2.open').removeClass('open');
      $('.job-details').hide();
      // Show job details for the clicked item
      showJobDetails(index);
      $(this).closest('.grid_container2').addClass('open');
    } else {
      // If it's already open, close it
      $(this).closest('.grid_container2').removeClass('open');
      $('.job-details').hide();
    }
  });
}


    // Function to filter job listings based on user selections
function filterJobListings() {
    const roleFilter = $("#role-filter").val();
    const levelFilter = $("#level-filter").val();
    const languageFilter = $("#language-filter").val();
    const toolsFilter = $("#tools-filter").val();
    
    // Apply filters
    const filteredListings = jobListings.filter(job => {
        return (
            (roleFilter === '' || job.role === roleFilter) &&
            (levelFilter === '' || job.level === levelFilter) &&
            (languageFilter === '' || job.languages.includes(languageFilter)) &&
            (toolsFilter === '' || job.tools.includes(toolsFilter))
        );
    });
    
    displayJobListings(filteredListings);
}

// Add change event listeners to the filter dropdowns
$("#role-filter").change(filterJobListings);
$("#level-filter").change(filterJobListings);
$("#language-filter").change(filterJobListings);
$("#tools-filter").change(filterJobListings);




    // Function to populate the position filter dropdown
    function populatePositionFilter() {
      var positionFilter = $("#position-filter");
      positionFilter.empty(); // Clear previous options
      positionFilter.append('<option value="">All Positions</option>');

      // Get unique positions from the jobListings data
      var uniquePositions = [...new Set(jobListings.map(job => job.position))];

      // Populate the dropdown with positions
      uniquePositions.forEach(function (position) {
        positionFilter.append('<option value="' + position + '">' + position + '</option>');
      });
    }

    // Add change event listener to the position filter dropdown
    $("#position-filter").change(function () {
      var selectedPosition = $(this).val();

      if (selectedPosition === "") {
        // Show all job listings when no position is selected
        displayJobListings(jobListings);
      } else {
        // Filter and display job listings by selected position
        var filteredListings = jobListings.filter(job => job.position === selectedPosition);
        displayJobListings(filteredListings);
      }
    });

    // Function to show job details in the modal
    function showJobDetails(index) {
      var job = jobListings[index];
      $("#company-name").text(job.company);
      $("#position").text(job.position);
      $("#role").text(job.role);
      $("#level").text(job.level);
      $("#posted-at").text(job.postedAt);
      $("#contract").text(job.contract);
      $("#location").text(job.location);
      $("#languages").text(job.languages.join(', '));
      $("#tools").text(job.tools.join(', '));

      // Show the modal
      $(".job-details").show();
    }

    // Function to clear job details and hide the modal
    function clearJobDetails() {
      // Clear the job details
      $(".job-details span").text("");

      // Hide the modal
      $(".job-details").hide();
    }

    // Clear job details when "Clear" button in modal is clicked
    $("#clear-job").click(function () {
      var index = $(".grid_container2.open").index();
      if (index !== undefined) {
        jobListings.splice(index, 1);
        displayJobListings(jobListings);
        clearJobDetails();
      }
    });

    // Close the modal when "Close" button is clicked
    $("#close-details").click(function () {
      clearJobDetails();
    });

    // Show the Add Job modal when the button is clicked
    $("#add-job-button").click(function () {
      $("#add-job-modal").show();
    });

    // Hide the Add Job modal when the Cancel button is clicked
    $("#cancel-job").click(function () {
      $("#add-job-modal").hide();
    });

    // Handle job submission
    // Handle job submission
// Handle job submission
// Handle job submission
$("#submit-job").click(function () {
  // Get user input for the new job
  var jobTitle = $("#job-title").val();
  var jobLocation = $("#job-location").val();
  var jobType = $("#job-type").val();
  var jobLogo = $("#job-logo").val();
  var jobDescription = $("#job-description").val();
  var jobSkills = $("#job-skills").val().split(',');
  var jobCompany = $("#job-company").val(); // Get the selected company

  // Set the "postedAt" value to your desired value (e.g., "2d ago")
  var postedAt = "2d ago";

  // Create a new job listing object
  var newJobListing = {
    company: jobCompany, // Use the selected company
    logo: jobLogo,
    new: true, // Assume it's a new job
    featured: false, // Assume it's not featured
    position: jobTitle,
    role: "", // Update with the role if available
    level: "", // Update with the level if available
    postedAt: postedAt,
    contract: jobType,
    location: jobLocation,
    languages: [], // Initialize with an empty array
    tools: [], // Initialize with an empty array
  };

  // Add the job description if available
  if (jobDescription) {
    newJobListing.description = jobDescription;
  }

  // Add the job skills if available
  if (jobSkills.length > 0) {
    newJobListing.languages = jobSkills;
  }

  // Add the new job listing to the list
  jobListings.push(newJobListing);

  // Display the updated job listings
  displayJobListings(jobListings);

  // Clear the input fields
  $("#job-title").val("");
  $("#job-location").val("");
  $("#job-type").val("Full Time");
  $("#job-logo").val("../Assignment-1 Starter Code/images/eyecam-co.svg");
  $("#job-description").val("");
  $("#job-skills").val("");
  $("#job-company").val("Photosnap"); // Set a default company

  // Hide the Add Job modal
  $("#add-job-modal").hide();
});




    // Load job listings when the page loads
    loadJobListings();