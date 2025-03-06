function toggleAccountDropdown() {
    const dropdown = document.getElementById('accountDropdown');
    dropdown.classList.toggle('show');
    }
    
    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
    if (!e.target.closest('.account')) {
        document.getElementById('accountDropdown').classList.remove('show');
    }
    });


    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }