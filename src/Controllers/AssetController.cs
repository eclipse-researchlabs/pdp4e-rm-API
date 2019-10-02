using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Assets.Implementation.Commands;
using Core.Assets.Implementation.Commands.Assets;
using Core.Assets.Implementation.Commands.Edges;
using Core.Assets.Implementation.Commands.Risks;
using Core.Assets.Implementation.Commands.Treatments;
using Core.Assets.Implementation.Commands.Vulnerabilities;
using Core.Assets.Interfaces.Services;
using Core.Assets.Models;
using Core.AuditTrail.Implementation.Commands;
using Core.AuditTrail.Interfaces.Services;
using Core.AuditTrail.Models;
using Core.Database.Enums;
using Core.Database.Models;
using Core.Database.Tables;
using Core.Relationships.Implementation.Commands;
using Core.Relationships.Interfaces.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Core.Api.Controllers
{
    [Route("api/assets"), ApiController, EnableCors("CorsRules")]
    public class AssetsController : ControllerBase
    {
        private IAssetService _assetService;
        private IAssetEdgeService _assetEdgeService;
        private IVulnerabilityService _vulnerabilityService;
        private IRelationshipService _relationshipService;
        private ITreatmentService _treatmentService;
        private IRiskService _riskService;
        private IAuditTrailService _auditTrailService;

        public AssetsController(IAssetService assetService, IVulnerabilityService vulnerabilityService, IRelationshipService relationshipService, ITreatmentService treatmentService, IRiskService riskService, IAuditTrailService auditTrailService, IAssetEdgeService assetEdgeService)
        {
            _assetService = assetService;
            _vulnerabilityService = vulnerabilityService;
            _relationshipService = relationshipService;
            _treatmentService = treatmentService;
            _riskService = riskService;
            _auditTrailService = auditTrailService;
            _assetEdgeService = assetEdgeService;
        }

        [HttpPost, ProducesResponseType(201)]
        public async Task<IActionResult> Create([FromBody] CreateAssetCommand command)
        {
            var newValue = await _assetService.Create(command);
            _auditTrailService.LogAction(AuditTrailAction.CreateAsset, newValue.Id, new AuditTrailPayloadModel(){ Data = JsonConvert.SerializeObject(command) });
            return Created(newValue.Id.ToString(), newValue);
        }

        [HttpPut("position"), ProducesResponseType(200)]
        public async Task<IActionResult> MovePosition([FromBody] UpdateAssetPositionCommand command)
        {
            var newValue = await _assetService.MovePosition(command);
            _auditTrailService.LogAction(AuditTrailAction.MoveAsset, command.AssetId, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok(newValue);
        }

        [HttpPut("name"), ProducesResponseType(200)]
        public async Task<IActionResult> UpdateName([FromBody] ChangeAssetNameCommand command)
        {
           _assetService.ChangeName(command);
            //_auditTrailService.LogAction(AuditTrailAction.MoveAsset, command.AssetId, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok();
        }

        [HttpPost("edge"), ProducesResponseType(201)]
        public async Task<IActionResult> CreateEdge([FromBody] CreateEdgeCommand command)
        {
            var newValue = await _relationshipService.Create(new CreateRelationshipCommand() { FromType = ObjectType.Asset, FromId  = command.Asset1Guid, ToType = ObjectType.Asset, ToId = command.Asset2Guid,
                Payload = JsonConvert.SerializeObject(new AssetEdgePayloadModel(){ Name = command.Name, Asset1Anchor = command.Asset1Anchor, Asset2Anchor = command.Asset2Anchor}) });
            return Created(newValue.Id.ToString(), newValue);
        }

        [HttpPut("edge/name"), ProducesResponseType(201)]
        public async Task<IActionResult> UpdateEdgeLabel([FromBody] ChangeEdgeLabelCommand command)
        {
            _assetEdgeService.Update(command);
            //_auditTrailService.LogAction(AuditTrailAction.CreateAssetEdge, newValue.Id, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok();
        }

        [HttpPost("groups"), ProducesResponseType(201)]
        public async Task<IActionResult> CreateGroup([FromBody] CreateAssetCommand command)
        {
            command.IsGroup = true;
            var newValue = await _assetService.Create(command);
            foreach (var item in command.Assets)
                _relationshipService.Create(new CreateRelationshipCommand() { FromType = ObjectType.AssetGroup, FromId = newValue.Id, ToType = ObjectType.Asset, ToId = item });

            _auditTrailService.LogAction(AuditTrailAction.CreateAssetGroup, newValue.Id, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Created(newValue.Id.ToString(), newValue);
        }

        [HttpDelete("groups/{ids}"), ProducesResponseType(201)]
        public async Task<IActionResult> DeleteGroup(string ids)
        {
            foreach (var id in ids.Split(',').ToList().ConvertAll(Guid.Parse))
            {
                _relationshipService.Delete(id);
                _auditTrailService.LogAction(AuditTrailAction.RemoveAssetGroup, id, new AuditTrailPayloadModel() {Data = JsonConvert.SerializeObject(id)});
            }
            return Ok();
        }

        [HttpDelete("{ids}"), ProducesResponseType(201)]
        public async Task<IActionResult> DeleteAsset(string ids)
        {
            foreach (var id in ids.Split(',').ToList().ConvertAll(Guid.Parse))
            {
                _assetService.Delete(id);
                //_auditTrailService.LogAction(AuditTrailAction.RemoveAssetGroup, id, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(id) });
            }
            return Ok();
        }
    }
}