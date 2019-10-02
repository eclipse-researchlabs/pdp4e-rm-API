using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Assets.Implementation.Commands.Treatments;
using Core.Assets.Interfaces.Services;
using Core.AuditTrail.Interfaces.Services;
using Core.AuditTrail.Models;
using Core.Database.Enums;
using Core.Database.Tables;
using Core.Relationships.Implementation.Commands;
using Core.Relationships.Interfaces.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Web.Controllers
{
    [Route("api/treatments"), ApiController, EnableCors("CorsRules")]
    public class TreatmentsController : ControllerBase
    {
        private readonly ITreatmentService _treatmentService;
        private readonly IRelationshipService _relationshipService;
        private readonly IAuditTrailService _auditTrailService;

        public TreatmentsController(ITreatmentService treatmentService, IRelationshipService relationshipService, IAuditTrailService auditTrailService)
        {
            _treatmentService = treatmentService;
            _relationshipService = relationshipService;
            _auditTrailService = auditTrailService;
        }

        [HttpPost, ProducesResponseType(201)]
        public async Task<IActionResult> CreateTreatment([FromBody] CreateTreatmentCommand command)
        {
            var newValue = await _treatmentService.Create(command);
            _relationshipService.Create(new CreateRelationshipCommand() { FromType = ObjectType.Asset, FromId = command.AssetId, ToType = ObjectType.Treatment, ToId = newValue.Id });
            _relationshipService.Create(new CreateRelationshipCommand() { FromType = ObjectType.Risk, FromId = command.RiskId, ToType = ObjectType.Treatment, ToId = newValue.Id });
            _auditTrailService.LogAction(AuditTrailAction.CreateTreatment, newValue.Id, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Created(newValue.Id.ToString(), newValue);
        }
    }
}